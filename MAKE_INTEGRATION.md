# Make.com Integration Guide - Error Handling

This document explains how Make.com scenarios should send error callbacks to Rosie for proper error categorization and user feedback.

## Callback Endpoint

**URL:** `POST /api/make-callback`

**Authentication:** Include `X-Webhook-Secret` header with the value from `MAKE_WEBHOOK_SECRET` environment variable.

## Success Callback Payload

```json
{
  "user_id": 123,
  "agent_type": "agent_a",
  "run_number": 1,
  "status": "success",
  "message": "Run completed successfully",
  "data": {
    "results": "Any workflow-specific data here"
  }
}
```

## Error Callback Payload

When a workflow fails, include these fields to enable proper error categorization:

```json
{
  "user_id": 123,
  "agent_type": "agent_a",
  "run_number": 1,
  "status": "failed",
  "message": "Brief technical error description",
  "error_type": "validation|data_quality|workflow|transport",
  "error_detail": "Detailed error message for debugging",
  "field_name": "email",  
  "email": "invalid@email",
  "data": {}
}
```

### Error Types

#### 1. **validation** - Pre-flight validation failures
Used when required conditions aren't met before workflow can run.

**Example scenarios:**
- Deal not in correct CRM trigger stage
- Missing required fields (company name, contact info, etc.)
- Workflow prerequisites not satisfied

**Payload:**
```json
{
  "error_type": "validation",
  "message": "Deal not in trigger stage",
  "error_detail": "Deal must be in 'Prospecting' stage before running Flow 1"
}
```

**User sees:**
```
⚠️ CRM Stage Check Failed

The deal must be in the correct CRM trigger stage before running this workflow.

Next steps:
1. Verify the deal is in the proper stage in your CRM
2. Move the deal if needed
3. Try again once confirmed
```

#### 2. **data_quality** - Data format/validation errors
Used when data exists but format is invalid.

**Example scenarios:**
- Invalid email format
- Invalid phone number
- Malformed data

**Payload:**
```json
{
  "error_type": "data_quality",
  "message": "Invalid email format",
  "error_detail": "Email address 'john@invalid' is not valid",
  "email": "john@invalid"
}
```

**User sees:**
```
⚠️ Email Format Error

The email address appears to be invalid: john@invalid

Next steps:
1. Check the email address in your CRM
2. Correct any typos
3. Try again
```

#### 3. **workflow** - Business logic or CRM API errors
Used for errors during workflow execution.

**Example scenarios:**
- CRM API connection failure
- Permission errors
- Business rule violations

**Payload:**
```json
{
  "error_type": "workflow",
  "message": "CRM API error",
  "error_detail": "Failed to connect to HubSpot API: 401 Unauthorized"
}
```

**User sees:**
```
❌ CRM Connection Error

Couldn't connect to your CRM.

Next steps:
1. Check your CRM connection in Make.com
2. Verify API credentials are valid
3. Try again in a few minutes
```

#### 4. **transport** - Network, timeout, service errors (RETRYABLE)
Used for temporary connectivity or service issues. Rosie will automatically retry these.

**Example scenarios:**
- Network timeout
- Service temporarily unavailable
- Connection refused

**Payload:**
```json
{
  "error_type": "transport",
  "message": "Connection timeout",
  "error_detail": "Request to CRM timed out after 30 seconds"
}
```

**User sees:**
```
⏱️ Workflow Timeout

The workflow is taking longer than expected.

What this means:
This might be a temporary issue. I'll automatically retry.

If it keeps happening:
Contact support with this run number: #12345
```

## Agent Name Mapping

Make.com scenarios use different agent names than the Rosie UI:

| Make.com | Rosie Internal | Description |
|----------|---------------|-------------|
| agent_a  | shortlist     | Agent A - Deal Shortlist |
| agent_b  | intros        | Agent B - Introductions |
| agent_c  | triage        | Agent C - Deal Triage |
| agent_d  | updates       | Agent D - Deal Updates |
| agent_e  | sync          | Agent E - CRM Sync |
| agent_f  | inventory     | Agent F - Inventory Check |

## Best Practices

1. **Always include `error_type`** - This enables proper categorization
2. **Provide detailed `error_detail`** - Helps with debugging
3. **Include context fields** - Add `field_name`, `email`, etc. when relevant
4. **Use correct status** - Either "success" or "failed", not "error"
5. **Log errors internally** - Keep Make.com execution logs for troubleshooting

## Implementation Checklist

For each Make.com scenario:

- [ ] Add error handler module at the end
- [ ] Classify errors into one of 4 types
- [ ] Include all required fields in callback payload
- [ ] Add `X-Webhook-Secret` header
- [ ] Test error scenarios (invalid data, missing fields, etc.)
- [ ] Verify user-friendly messages appear in Rosie UI

## Testing Error Handling

You can test error handling by triggering workflows with:

1. **Validation errors**: Put deal in wrong CRM stage
2. **Data quality errors**: Use invalid email format in CRM
3. **Workflow errors**: Temporarily disable CRM API credentials
4. **Transport errors**: Add artificial delay/timeout to HTTP requests

Each error type should display appropriate user guidance in Rosie.
