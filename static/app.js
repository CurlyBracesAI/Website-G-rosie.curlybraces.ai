        const chatMessages = document.getElementById('chatMessages');
        const messageInput = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendButton');
        const projectSelector = document.getElementById('projectSelector');
        
        let conversationHistory = [];
        let currentProjectId = null;
        let projectColors = {}; // Store project colors
        let currentAgent = null; // Store selected agent mode
        let pendingWorkflowTrigger = false; // Waiting for run number selection
        let agentMaxRuns = 3; // Max runs for current agent
        
        function formatResponse(text) {
            // For assistant messages, add line breaks before bullet points
            let formatted = text;
            
            // Add newline before bullets that come after colons: " - **Item**:"
            formatted = formatted.replace(/(:\s+-\s+)/g, ':\n\n- ');
            
            // Add newline before bullets that come after periods: ". - **Item**:"
            formatted = formatted.replace(/(\.\s+-\s+)/g, '.\n\n- ');
            
            // Clean up any excessive newlines (more than 2)
            formatted = formatted.replace(/\n{3,}/g, '\n\n');
            
            // Convert markdown headers to HTML (before converting ** to avoid conflicts)
            formatted = formatted.replace(/^### (.+)$/gm, '<h3 style="font-size: 16px; font-weight: 600; margin: 10px 0 5px 0;">$1</h3>');
            formatted = formatted.replace(/^## (.+)$/gm, '<h2 style="font-size: 18px; font-weight: 600; margin: 12px 0 6px 0;">$1</h2>');
            formatted = formatted.replace(/^# (.+)$/gm, '<h1 style="font-size: 20px; font-weight: 700; margin: 15px 0 8px 0;">$1</h1>');
            
            // Convert markdown bold to HTML
            formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
            
            // Convert newlines to <br> tags for HTML display
            formatted = formatted.replace(/\n/g, '<br>');
            
            return formatted.trim();
        }
        
        function addMessage(role, content) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${role}`;
            
            const label = document.createElement('div');
            label.className = 'message-label';
            label.textContent = role === 'user' ? 'You' : 'Rosie';
            
            const contentDiv = document.createElement('div');
            contentDiv.className = 'message-content';
            
            // Format assistant messages to add line breaks before bullets and render markdown
            if (role === 'assistant') {
                contentDiv.innerHTML = formatResponse(content);
            } else {
                contentDiv.textContent = content;
            }
            
            messageDiv.appendChild(label);
            messageDiv.appendChild(contentDiv);
            chatMessages.appendChild(messageDiv);
            
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
        function showTypingIndicator() {
            const typingDiv = document.createElement('div');
            typingDiv.className = 'message assistant';
            typingDiv.id = 'typingIndicator';
            
            const label = document.createElement('div');
            label.className = 'message-label';
            label.textContent = 'Rosie';
            
            const indicator = document.createElement('div');
            indicator.className = 'typing-indicator active';
            indicator.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
            
            typingDiv.appendChild(label);
            typingDiv.appendChild(indicator);
            chatMessages.appendChild(typingDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
        function hideTypingIndicator() {
            const indicator = document.getElementById('typingIndicator');
            if (indicator) {
                indicator.remove();
            }
        }
        
        // Check if message is a workflow confirmation
        function isWorkflowConfirmation(message) {
            const confirmKeywords = [
                'confirmed', 'confirm', 'ready', 'yes', 'yep', 'yeah', 'sure',
                'go ahead', 'proceed', 'run it', 'do it', 'let\'s go', 'ok', 'okay',
                'good to go', 'all set', 'verified', 'done', 'go', 'affirmative'
            ];
            
            const lowerMessage = message.toLowerCase().trim();
            return confirmKeywords.some(keyword => lowerMessage.includes(keyword));
        }
        
        // Workflow polling state
        let workflowPollingInterval = null;
        let lastCheckedStatus = null;
        
        // Start polling for workflow completion
        function startWorkflowPolling(runNumber, maxRuns) {
            // Clear any existing polling
            if (workflowPollingInterval) {
                clearInterval(workflowPollingInterval);
            }
            
            let pollCount = 0;
            const maxPolls = 60; // Poll for up to 5 minutes (60 * 5 seconds)
            
            workflowPollingInterval = setInterval(async () => {
                pollCount++;
                
                try {
                    const response = await fetch('/api/poll-workflow-status');
                    const data = await response.json();
                    
                    if (data.success && data.status !== 'none' && data.status !== 'pending') {
                        // Workflow completed or failed
                        clearInterval(workflowPollingInterval);
                        workflowPollingInterval = null;
                        
                        if (data.status === 'success') {
                            // Success message
                            let completionMessage = `✅ Flow ${data.run_number} completed successfully!`;
                            
                            if (data.message) {
                                completionMessage += `\n\n${data.message}`;
                            }
                            
                            // Dynamic flow options based on agent's max runs
                            let flowOptions;
                            if (maxRuns === 1) {
                                flowOptions = '1';
                            } else if (maxRuns === 2) {
                                flowOptions = '1 or 2';
                            } else {
                                flowOptions = `1 to ${maxRuns}`;
                            }
                            
                            completionMessage += `\n\n**Need to run another flow?** Just let me know which one (${flowOptions}) and I'll trigger it for you.`;
                            
                            addMessage('assistant', completionMessage);
                            
                            // Reset failure count on successful completion
                            sessionStorage.removeItem('workflow_failure_count');
                        } else if (data.status === 'failed') {
                            // Show user-friendly error message with category-specific guidance
                            let errorMessage = data.error_message || data.message || `❌ Run ${data.run_number} failed.`;
                            
                            // Log error category for debugging
                            if (data.error_category) {
                                console.log(`Error category: ${data.error_category}`);
                            }
                            
                            addMessage('assistant', errorMessage);
                            
                            // Reset failure count on successful callback (even if failed status)
                            sessionStorage.removeItem('workflow_failure_count');
                        }
                    } else if (pollCount >= maxPolls) {
                        // Timeout - stop polling, likely Bridge scenario never started
                        clearInterval(workflowPollingInterval);
                        workflowPollingInterval = null;
                        
                        // Track consecutive failures for escalating troubleshooting guidance
                        let failureCount = parseInt(sessionStorage.getItem('workflow_failure_count') || '0');
                        failureCount++;
                        sessionStorage.setItem('workflow_failure_count', failureCount.toString());
                        
                        let troubleshootingMessage;
                        
                        if (failureCount === 1) {
                            // First failure: Check trigger stage
                            troubleshootingMessage = '⚠️ **The workflow is failing to trigger.**\n\nThe most common cause is that the deal hasn\'t been placed in the correct trigger stage in Pipedrive.\n\n**Next steps:**\n1. Check that your deal is in the trigger stage\n2. Move it to the correct stage if needed\n3. Try running the flow again\n\nIf you\'ve confirmed the trigger stage is correct and this keeps happening, let me know.';
                        } else if (failureCount === 2) {
                            // Second failure: Check AI confirmation flow stages
                            troubleshootingMessage = '⚠️ **Still failing to trigger.**\n\nIf the trigger stage is correct, the next most common issue is the **AI confirmation flow stages being marked "Yes"**.\n\n**Next steps:**\n1. Check all AI confirmation flow stages in Pipedrive\n2. Make sure they are NOT marked "Yes" (should be blank or "No")\n3. Update any stages marked "Yes" to blank\n4. Try running the flow again\n\nIf you\'ve checked both of these and it still fails, let me know and I\'ll help investigate further.';
                        } else {
                            // Third+ failure: General troubleshooting
                            troubleshootingMessage = '⚠️ **Workflow still not triggering.**\n\nYou\'ve confirmed:\n✓ Deal is in the correct trigger stage\n✓ AI confirmation flow stages aren\'t marked "Yes"\n\nThis might be a more complex issue. Please let me know and I can help troubleshoot, or contact support if you need immediate assistance.\n\n**For reference:** Individual module failures (like missing phone numbers) are normal and won\'t prevent the workflow from running - those just skip that specific step (e.g., no SMS if phone is missing).';
                        }
                        
                        addMessage('assistant', troubleshootingMessage);
                    }
                } catch (error) {
                    console.error('Error polling workflow status:', error);
                    // Don't stop polling on error, just log it
                }
            }, 5000); // Poll every 5 seconds
        }
        
        async function sendMessage() {
            const message = messageInput.value.trim();
            if (!message) return;
            
            const enableSearch = document.getElementById('enableSearch').checked;
            
            addMessage('user', message);
            messageInput.value = '';
            
            // Check if we're waiting for run number selection
            if (pendingWorkflowTrigger) {
                const runNumber = parseInt(message);
                
                if (runNumber >= 1 && runNumber <= agentMaxRuns) {
                    console.log(`🚀 Run number ${runNumber} selected, triggering workflow...`);
                    pendingWorkflowTrigger = false;
                    sendButton.disabled = true;
                    showTypingIndicator();
                    
                    // Trigger Make.com workflow with selected run number
                    try {
                        console.log('📡 Sending request to /api/trigger-workflow');
                        const response = await fetch('/api/trigger-workflow', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                run_number: runNumber,
                                conversation_context: conversationHistory.slice(-5)
                            })
                        });
                        
                        console.log('📥 Response received:', response.status);
                        const data = await response.json();
                        console.log('📦 Response data:', data);
                        hideTypingIndicator();
                        
                        if (data.success) {
                            let runMessage = `🚀 Flow ${runNumber} requested - checking workflow status...`;
                            addMessage('assistant', runMessage);
                            
                            // Start polling for workflow completion
                            startWorkflowPolling(data.run_number, data.max_runs);
                        } else {
                            addMessage('assistant', `❌ Failed to trigger workflow: ${data.error || 'Unknown error'}`);
                        }
                        
                        sendButton.disabled = false;
                    } catch (error) {
                        hideTypingIndicator();
                        console.error('Error triggering workflow:', error);
                        addMessage('assistant', "❌ Sorry, I couldn't trigger the workflow. Please try again or contact support.");
                        sendButton.disabled = false;
                    }
                    return;
                } else {
                    // Invalid run number
                    addMessage('assistant', `Please enter a valid flow number between 1 and ${agentMaxRuns}.`);
                    return;
                }
            }
            
            // Check for workflow confirmation if an agent is active
            if (currentAgent && isWorkflowConfirmation(message)) {
                console.log('🚀 Workflow confirmation detected, asking for run number...');
                pendingWorkflowTrigger = true;
                
                // Ask which flow to run
                let flowPrompt = `Which flow would you like to run?`;
                
                if (agentMaxRuns === 1) {
                    flowPrompt = 'Running the workflow...';
                    pendingWorkflowTrigger = false;
                    // Auto-trigger for single-run agents
                    sendMessage.call(this, {target: {value: '1'}});
                    return;
                } else if (agentMaxRuns === 2) {
                    flowPrompt += ` Enter **1** or **2**.`;
                } else {
                    flowPrompt += ` Enter **1**, **2**, or **3**.`;
                }
                
                addMessage('assistant', flowPrompt);
                return;
            }
            
            sendButton.disabled = true;
            showTypingIndicator();
            
            try {
                const response = await fetch('/rosie-test', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: message,
                        history: conversationHistory,
                        enable_search: enableSearch
                    })
                });
                
                const data = await response.json();
                
                hideTypingIndicator();
                
                if (data.success) {
                    let assistantMessage = data.message;
                    
                    // Check for intelligent workflow trigger marker [TRIGGER_FLOW:N]
                    const triggerMatch = assistantMessage.match(/\[TRIGGER_FLOW:(\d+)\]/);
                    
                    if (triggerMatch && currentAgent) {
                        const extractedRunNumber = parseInt(triggerMatch[1]);
                        
                        // Remove the marker from the display message
                        const cleanMessage = assistantMessage.replace(/\[TRIGGER_FLOW:\d+\]/g, '').trim();
                        addMessage('assistant', cleanMessage);
                        
                        // Validate run number is within agent's allowed range
                        if (extractedRunNumber >= 1 && extractedRunNumber <= agentMaxRuns) {
                            console.log(`🤖 AI extracted run number: ${extractedRunNumber}, triggering workflow...`);
                            
                            // Trigger workflow automatically
                            sendButton.disabled = true;
                            
                            setTimeout(async () => {
                                try {
                                    console.log('📡 Auto-triggering workflow from intelligent parsing');
                                    const response = await fetch('/api/trigger-workflow', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            run_number: extractedRunNumber,
                                            conversation_context: conversationHistory.slice(-5)
                                        })
                                    });
                                    
                                    const workflowData = await response.json();
                                    
                                    if (workflowData.success) {
                                        // Start polling for workflow completion
                                        startWorkflowPolling(workflowData.run_number, workflowData.max_runs);
                                    } else {
                                        addMessage('assistant', `❌ Failed to trigger workflow: ${workflowData.error || 'Unknown error'}`);
                                    }
                                    
                                    sendButton.disabled = false;
                                } catch (error) {
                                    console.error('Error auto-triggering workflow:', error);
                                    addMessage('assistant', "❌ Sorry, I couldn't trigger the workflow. Please try again.");
                                    sendButton.disabled = false;
                                }
                            }, 500); // Small delay for UX
                        } else {
                            console.warn(`Invalid run number extracted: ${extractedRunNumber}`);
                            addMessage('assistant', `⚠️ I detected you want to run flow ${extractedRunNumber}, but this agent only supports flows 1-${agentMaxRuns}.`);
                        }
                    } else {
                        // Normal message without workflow trigger
                        addMessage('assistant', assistantMessage);
                    }
                    
                    conversationHistory.push({
                        role: 'user',
                        content: message
                    });
                    conversationHistory.push({
                        role: 'assistant',
                        content: data.message
                    });
                } else {
                    addMessage('assistant', 'Sorry, something went wrong: ' + data.error);
                }
            } catch (error) {
                hideTypingIndicator();
                addMessage('assistant', 'Sorry, I encountered an error: ' + error.message);
            } finally {
                sendButton.disabled = false;
                messageInput.focus();
            }
        }
        
        sendButton.addEventListener('click', sendMessage);
        
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
        
        // Modal management
        function openModal(modalId) {
            document.getElementById(modalId).classList.add('active');
        }
        
        function closeModal(modalId) {
            document.getElementById(modalId).classList.remove('active');
        }
        
        // Load all projects on page load
        async function loadProjects() {
            try {
                const response = await fetch('/projects');
                const data = await response.json();
                
                if (data.success) {
                    projectSelector.innerHTML = '<option value="">Select Project...</option>';
                    data.projects.forEach(project => {
                        // Store project color
                        projectColors[project.id] = project.color || '#06b6d4';
                        
                        const option = document.createElement('option');
                        option.value = project.id;
                        option.textContent = `● ${project.name}`;
                        option.style.color = project.color || '#06b6d4';
                        projectSelector.appendChild(option);
                    });
                }
            } catch (error) {
                console.error('Failed to load projects:', error);
            }
        }
        
        // Create new project
        async function createProject() {
            const name = document.getElementById('newProjectName').value.trim();
            if (!name) {
                alert('Please enter a project name');
                return;
            }
            
            try {
                const response = await fetch('/projects', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    closeModal('newProjectModal');
                    document.getElementById('newProjectName').value = '';
                    await loadProjects();
                    projectSelector.value = data.project.id;
                    currentProjectId = data.project.id;
                } else {
                    alert('Error creating project: ' + data.error);
                }
            } catch (error) {
                alert('Failed to create project: ' + error.message);
            }
        }
        
        // Save conversation
        async function saveConversation() {
            const title = document.getElementById('conversationTitle').value.trim();
            if (!title) {
                alert('Please enter a conversation title');
                return;
            }
            
            if (!currentProjectId) {
                alert('Please select a project first');
                return;
            }
            
            if (conversationHistory.length === 0) {
                alert('No conversation to save');
                return;
            }
            
            try {
                const response = await fetch('/conversations', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        project_id: currentProjectId,
                        title: title,
                        messages: conversationHistory
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    closeModal('saveConversationModal');
                    document.getElementById('conversationTitle').value = '';
                    alert('Conversation saved successfully!');
                } else {
                    alert('Error saving conversation: ' + data.error);
                }
            } catch (error) {
                alert('Failed to save conversation: ' + error.message);
            }
        }
        
        // Load conversations for selected project
        async function loadConversationsForProject() {
            const projectId = projectSelector.value;
            if (!projectId) {
                alert('Please select a project first to view saved conversations');
                return;
            }
            
            try {
                const response = await fetch(`/projects/${projectId}/conversations`);
                const data = await response.json();
                
                if (data.success) {
                    const conversationSelector = document.getElementById('conversationSelector');
                    conversationSelector.innerHTML = '<option value="">Select a conversation...</option>';
                    
                    const currentColor = projectColors[projectId] || '#06b6d4';
                    
                    data.conversations.forEach(conv => {
                        const option = document.createElement('option');
                        option.value = conv.id;
                        option.textContent = `● ${conv.title} (${new Date(conv.updated_at).toLocaleDateString()})`;
                        option.style.color = currentColor;
                        conversationSelector.appendChild(option);
                    });
                    
                    openModal('loadConversationModal');
                }
            } catch (error) {
                alert('Failed to load conversations: ' + error.message);
            }
        }
        
        // Load selected conversation
        async function loadSelectedConversation() {
            const conversationId = document.getElementById('conversationSelector').value;
            if (!conversationId) {
                alert('Please select a conversation');
                return;
            }
            
            try {
                const response = await fetch(`/conversations/${conversationId}`);
                const data = await response.json();
                
                if (data.success) {
                    // Clear current chat
                    chatMessages.innerHTML = '';
                    conversationHistory = data.conversation.messages;
                    
                    // Display all messages
                    conversationHistory.forEach(msg => {
                        addMessage(msg.role, msg.content);
                    });
                    
                    closeModal('loadConversationModal');
                } else {
                    alert('Error loading conversation: ' + data.error);
                }
            } catch (error) {
                alert('Failed to load conversation: ' + error.message);
            }
        }
        
        // Rename selected conversation
        async function renameSelectedConversation() {
            const conversationId = document.getElementById('conversationSelector').value;
            if (!conversationId) {
                alert('Please select a conversation to rename');
                return;
            }
            
            const currentTitle = document.getElementById('conversationSelector').selectedOptions[0].textContent;
            const newTitle = prompt('Enter new conversation title:', currentTitle);
            
            if (!newTitle || newTitle === currentTitle) {
                return;
            }
            
            try {
                const response = await fetch(`/conversations/${conversationId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title: newTitle })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    alert('Conversation renamed successfully');
                    closeModal('loadConversationModal');
                } else {
                    alert('Error renaming conversation: ' + data.error);
                }
            } catch (error) {
                alert('Failed to rename conversation: ' + error.message);
            }
        }
        
        // Delete selected conversation
        async function deleteSelectedConversation() {
            const conversationId = document.getElementById('conversationSelector').value;
            if (!conversationId) {
                alert('Please select a conversation to delete');
                return;
            }
            
            const conversationTitle = document.getElementById('conversationSelector').selectedOptions[0].textContent;
            
            if (!confirm(`Are you sure you want to delete "${conversationTitle}"? This cannot be undone.`)) {
                return;
            }
            
            try {
                const response = await fetch(`/conversations/${conversationId}`, {
                    method: 'DELETE'
                });
                
                const data = await response.json();
                
                if (data.success) {
                    alert('Conversation deleted successfully');
                    closeModal('loadConversationModal');
                } else {
                    alert('Error deleting conversation: ' + data.error);
                }
            } catch (error) {
                alert('Failed to delete conversation: ' + error.message);
            }
        }
        
        // Open manage projects modal
        async function openManageProjectsModal() {
            try {
                const response = await fetch('/projects');
                const data = await response.json();
                
                if (data.success) {
                    const selector = document.getElementById('manageProjectSelector');
                    selector.innerHTML = '<option value="">Select a project...</option>';
                    
                    data.projects.forEach(proj => {
                        const option = document.createElement('option');
                        option.value = proj.id;
                        option.textContent = proj.name;
                        selector.appendChild(option);
                    });
                    
                    openModal('manageProjectsModal');
                } else {
                    alert('Error loading projects: ' + data.error);
                }
            } catch (error) {
                alert('Failed to load projects: ' + error.message);
            }
        }
        
        // Rename selected project
        async function renameSelectedProject() {
            const projectId = document.getElementById('manageProjectSelector').value;
            if (!projectId) {
                alert('Please select a project to rename');
                return;
            }
            
            const currentName = document.getElementById('manageProjectSelector').selectedOptions[0].textContent;
            const newName = prompt('Enter new project name:', currentName);
            
            if (!newName || newName === currentName) {
                return;
            }
            
            try {
                const response = await fetch(`/projects/${projectId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: newName })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    alert('Project renamed successfully');
                    closeModal('manageProjectsModal');
                    loadProjects(); // Refresh the main project selector
                } else {
                    alert('Error renaming project: ' + data.error);
                }
            } catch (error) {
                alert('Failed to rename project: ' + error.message);
            }
        }
        
        // Delete selected project
        async function deleteSelectedProject() {
            const projectId = document.getElementById('manageProjectSelector').value;
            if (!projectId) {
                alert('Please select a project to delete');
                return;
            }
            
            const projectName = document.getElementById('manageProjectSelector').selectedOptions[0].textContent;
            
            if (!confirm(`⚠️ WARNING: Delete project "${projectName}"?\n\nThis will permanently delete the project AND all conversations inside it.\n\nThis action cannot be undone!`)) {
                return;
            }
            
            try {
                const response = await fetch(`/projects/${projectId}`, {
                    method: 'DELETE'
                });
                
                const data = await response.json();
                
                if (data.success) {
                    const conversationCount = data.deleted_conversations;
                    alert(`Project deleted successfully.\n${conversationCount} conversation(s) were also deleted.`);
                    closeModal('manageProjectsModal');
                    loadProjects(); // Refresh the main project selector
                } else {
                    alert('Error deleting project: ' + data.error);
                }
            } catch (error) {
                alert('Failed to delete project: ' + error.message);
            }
        }
        
        // New chat
        function startNewChat() {
            if (confirm('Start a new chat? Current conversation will be cleared unless saved.')) {
                chatMessages.innerHTML = '<div class="message assistant"><div class="message-label">Rosie</div><div class="message-content">Oi Collecott, Rosie here! What do you want knucklehead?</div></div>';
                conversationHistory = [];
                messageInput.focus();
            }
        }
        
        // Event listeners
        document.getElementById('newProjectBtn').addEventListener('click', () => openModal('newProjectModal'));
        document.getElementById('manageProjectsBtn').addEventListener('click', openManageProjectsModal);
        document.getElementById('saveConversationBtn').addEventListener('click', () => openModal('saveConversationModal'));
        document.getElementById('loadConversationBtn').addEventListener('click', loadConversationsForProject);
        document.getElementById('newChatBtn').addEventListener('click', startNewChat);
        
        projectSelector.addEventListener('change', (e) => {
            currentProjectId = e.target.value || null;
            
            // Update color badge to show selected project's color
            const badge = document.getElementById('projectColorBadge');
            if (currentProjectId && projectColors[currentProjectId]) {
                badge.style.backgroundColor = projectColors[currentProjectId];
                badge.style.display = 'inline-block';
            } else {
                badge.style.display = 'none';
            }
        });
        
        // Load current user and personalize greeting
        async function loadCurrentUser() {
            try {
                const response = await fetch('/api/me');
                const data = await response.json();
                
                if (data.success && data.user) {
                    const nameParts = data.user.name.split(' ');
                    const firstName = nameParts[0];
                    const lastName = nameParts[nameParts.length - 1];
                    const nickname = data.user.nickname || 'knucklehead';
                    document.getElementById('userGreeting').textContent = `${firstName}'s Agentic AI Automation`;
                    document.getElementById('initialGreeting').innerHTML = `Hey ${firstName}, Rosie here! How can I help you, you ${nickname}? You can ask me a question, or select one of the Agents below to launch a workflow.`;
                } else {
                    document.getElementById('userGreeting').textContent = "Agentic AI Automation";
                }
            } catch (error) {
                console.error('Failed to load user:', error);
                document.getElementById('userGreeting').textContent = "Agentic AI Automation";
            }
        }
        
        // Handle agent selection
        async function selectAgent(agentType, agentName, buttonElement) {
            console.log('📞 selectAgent called:', agentType, agentName);
            try {
                const response = await fetch('/api/set-agent', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ agent: agentType })
                });
                
                console.log('✅ Set-agent response:', response.status);
                if (response.ok) {
                    currentAgent = agentType;
                    console.log('✅ Current agent set to:', currentAgent);
                    
                    // Set max runs based on agent type
                    const agentRunConfig = {
                        'shortlist': 3,
                        'intros': 2,
                        'triage': 1,
                        'updates': 1,
                        'sync': 1,
                        'inventory': 1
                    };
                    agentMaxRuns = agentRunConfig[agentType] || 1;
                    console.log(`✅ Agent ${agentType} has ${agentMaxRuns} flows available`);
                    
                    // Reset workflow trigger state when switching agents
                    pendingWorkflowTrigger = false;
                    
                    // Update UI to show active agent
                    document.querySelectorAll('.agent-btn').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    buttonElement.classList.add('active');
                    
                    // Agent-specific confirmation messages
                    const agentMessages = {
                        'shortlist': `Switched to **${agentName}** mode. I'm ready to help with this workflow! Verify that the client deal is placed in the CRM **Agent A** trigger stage. Once confirmed, let me know and I will run the workflow for you.`,
                        'intros': `Switched to **${agentName}** mode. I'm ready to help with this workflow! Verify that the client deal is placed in the CRM **Agent B** trigger stage. Once confirmed, let me know and I will run the workflow for you.`,
                        'triage': `Switched to **${agentName}** mode. I'm ready to help with this workflow! Verify that the client deal is placed in the CRM **Agent C** trigger stage. Once confirmed, let me know and I will run the workflow for you.`,
                        'updates': `Switched to **${agentName}** mode. I'm ready to help with this workflow! Verify that the client deal is placed in the CRM **Agent D** trigger stage. Once confirmed, let me know and I will run the workflow for you.`,
                        'sync': `Switched to **${agentName}** mode. I'm ready to help with this workflow! Verify that the client deal is placed in the CRM **Agent E** trigger stage. Once confirmed, let me know and I will run the workflow for you.`,
                        'inventory': `Switched to **${agentName}** mode. I'm ready to help with this workflow! Verify that the client deal is placed in the CRM **Agent F** trigger stage. Once confirmed, let me know and I will run the workflow for you.`
                    };
                    
                    // Add confirmation message
                    const message = agentMessages[agentType] || `Switched to **${agentName}** mode. I'm ready to help with this workflow!`;
                    addMessage('assistant', message);
                }
            } catch (error) {
                console.error('Error selecting agent:', error);
            }
        }
        
        // Restore active agent on page load
        async function restoreActiveAgent() {
            try {
                const response = await fetch('/api/get-agent');
                if (response.ok) {
                    const data = await response.json();
                    if (data.agent) {
                        currentAgent = data.agent;
                        
                        // Find and mark the active button
                        const activeButton = document.querySelector(`.agent-btn[data-agent="${data.agent}"]`);
                        if (activeButton) {
                            activeButton.classList.add('active');
                        }
                    }
                }
            } catch (error) {
                console.error('Error restoring agent:', error);
            }
        }
        
        // Attach agent button listeners
        function initAgentButtons() {
            console.log('🔧 Initializing agent buttons...');
            document.querySelectorAll('.agent-btn').forEach(button => {
                console.log('Found agent button:', button.dataset.agent);
                button.addEventListener('click', function() {
                    const agentType = this.dataset.agent;
                    const agentName = this.querySelector('.agent-btn-title').textContent.trim();
                    console.log('🎯 Agent button clicked:', agentType, agentName);
                    selectAgent(agentType, agentName, this);
                });
            });
        }
        
        // Handle logout
        async function handleLogout() {
            if (!confirm('Are you sure you want to logout?')) {
                return;
            }
            
            try {
                await fetch('/api/logout', { method: 'POST' });
                window.location.href = '/';
            } catch (error) {
                alert('Logout failed. Please try again.');
            }
        }
        
        // Load user info and projects on page load
        loadCurrentUser();
        loadProjects();
        initAgentButtons();
        restoreActiveAgent();
        messageInput.focus();
