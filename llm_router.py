import os
from typing import List, Dict, Any, Optional
from openai import OpenAI

class LLMRouter:
    def __init__(self):
        self.openai_client = None
        
    def _get_openai_client(self):
        if not self.openai_client:
            api_key = os.getenv('OPENAI_API_KEY')
            if not api_key:
                raise ValueError("OPENAI_API_KEY not found in environment variables")
            self.openai_client = OpenAI(api_key=api_key)
        return self.openai_client
    
    def _call_openai(
        self,
        messages: List[Dict[str, str]],
        model: str = "gpt-4o-mini",
        temperature: float = 0.7,
        max_tokens: int = 500
    ) -> Dict[str, Any]:
        client = self._get_openai_client()
        
        response = client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens
        )
        
        return {
            'message': response.choices[0].message.content,
            'model': response.model,
            'provider': 'openai',
            'usage': {
                'prompt_tokens': response.usage.prompt_tokens,
                'completion_tokens': response.usage.completion_tokens,
                'total_tokens': response.usage.total_tokens
            }
        }
    
    def _call_anthropic(
        self,
        messages: List[Dict[str, str]],
        model: str = "claude-3-5-sonnet-20241022",
        temperature: float = 0.7,
        max_tokens: int = 500
    ) -> Dict[str, Any]:
        raise NotImplementedError(
            "Anthropic provider not yet implemented. "
            "Add ANTHROPIC_API_KEY to secrets and install the anthropic package to enable."
        )
    
    def _call_google(
        self,
        messages: List[Dict[str, str]],
        model: str = "gemini-pro",
        temperature: float = 0.7,
        max_tokens: int = 500
    ) -> Dict[str, Any]:
        raise NotImplementedError(
            "Google provider not yet implemented. "
            "Add GOOGLE_API_KEY to secrets and install the google-generativeai package to enable."
        )
    
    def call_llm(
        self,
        user_message: str,
        system_prompt: str,
        history: Optional[List[Dict[str, str]]] = None,
        provider: str = "openai",
        model: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 500
    ) -> Dict[str, Any]:
        messages = [{'role': 'system', 'content': system_prompt}]
        
        if history:
            messages.extend(history)
        
        messages.append({'role': 'user', 'content': user_message})
        
        provider = provider.lower()
        
        if provider == "openai":
            return self._call_openai(
                messages=messages,
                model=model or "gpt-4o-mini",
                temperature=temperature,
                max_tokens=max_tokens
            )
        elif provider == "anthropic":
            return self._call_anthropic(
                messages=messages,
                model=model or "claude-3-5-sonnet-20241022",
                temperature=temperature,
                max_tokens=max_tokens
            )
        elif provider == "google":
            return self._call_google(
                messages=messages,
                model=model or "gemini-pro",
                temperature=temperature,
                max_tokens=max_tokens
            )
        else:
            raise ValueError(
                f"Unsupported provider: {provider}. "
                f"Supported providers: openai, anthropic (coming soon), google (coming soon)"
            )

router = LLMRouter()

def call_llm(
    user_message: str,
    system_prompt: str,
    history: Optional[List[Dict[str, str]]] = None,
    provider: str = "openai",
    model: Optional[str] = None,
    temperature: float = 0.7,
    max_tokens: int = 500
) -> Dict[str, Any]:
    return router.call_llm(
        user_message=user_message,
        system_prompt=system_prompt,
        history=history,
        provider=provider,
        model=model,
        temperature=temperature,
        max_tokens=max_tokens
    )
