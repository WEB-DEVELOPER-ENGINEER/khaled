# Sign Language Chatbot API

**Version:** 1.0.0 | **Spec:** OAS 3.1  
**Base URL:** `https://allamxmax-sign-language-chatbot.hf.space`  
**Description:** Chatbot API for Sign Language Assistant App

---

## Endpoints

### GET `/`
**Root**

Returns a simple string response to confirm the API is running.

**Parameters:** None

**Response 200**
```json
"string"
```

---

### POST `/chat/new-session`
**New Session** — بدء محادثة جديدة

Creates a new chat session for a user.

**Request Body** `application/json`
```json
{
  "user_id": "string"
}
```

**Response 200**
```json
{
  "success": true,
  "session_id": "string"
}
```

**Response 422 — Validation Error**
```json
{
  "detail": [
    {
      "loc": ["string", 0],
      "msg": "string",
      "type": "string",
      "input": "string",
      "ctx": {}
    }
  ]
}
```

---

### POST `/chat`
**Chat** — إرسال رسالة والحصول على رد

Sends a message in an existing session and returns the bot's reply.

**Request Body** `application/json`
```json
{
  "session_id": "string",
  "message": "string"
}
```

**Response 200**
```json
{
  "success": true,
  "session_id": "string",
  "reply": "string",
  "error": "string"
}
```

**Response 422 — Validation Error**
```json
{
  "detail": [
    {
      "loc": ["string", 0],
      "msg": "string",
      "type": "string",
      "input": "string",
      "ctx": {}
    }
  ]
}
```

---

### GET `/chat/history/{session_id}`
**History** — جلب تاريخ المحادثة

Retrieves the full message history for a given session.

**Path Parameters**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `session_id` | string | ✅ | The session ID |

**Response 200**
```json
{
  "success": true,
  "session_id": "string",
  "messages": [
    {
      "role": "string",
      "content": "string",
      "timestamp": "string"
    }
  ],
  "error": "string"
}
```

**Response 422 — Validation Error**
```json
{
  "detail": [
    {
      "loc": ["string", 0],
      "msg": "string",
      "type": "string",
      "input": "string",
      "ctx": {}
    }
  ]
}
```

---

### DELETE `/chat/history/{session_id}`
**Delete History** — حذف محادثة

Deletes the chat history for a given session.

**Path Parameters**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `session_id` | string | ✅ | The session ID |

**Response 200**
```json
{
  "success": true,
  "message": "string",
  "error": "string"
}
```

**Response 422 — Validation Error**
```json
{
  "detail": [
    {
      "loc": ["string", 0],
      "msg": "string",
      "type": "string",
      "input": "string",
      "ctx": {}
    }
  ]
}
```

---

## Schemas

### `NewSessionRequest`
```json
{
  "user_id": "string"
}
```

### `NewSessionResponse`
```json
{
  "success": true,
  "session_id": "string"
}
```

### `SendMessageRequest`
```json
{
  "session_id": "string",
  "message": "string"
}
```

### `SendMessageResponse`
```json
{
  "success": true,
  "session_id": "string",
  "reply": "string",
  "error": "string"
}
```

### `ChatHistoryMessage`
```json
{
  "role": "string",
  "content": "string",
  "timestamp": "string"
}
```

### `ChatHistoryResponse`
```json
{
  "success": true,
  "session_id": "string",
  "messages": [
    {
      "role": "string",
      "content": "string",
      "timestamp": "string"
    }
  ],
  "error": "string"
}
```

### `DeleteSessionResponse`
```json
{
  "success": true,
  "message": "string",
  "error": "string"
}
```

### `HTTPValidationError`
```json
{
  "detail": [
    {
      "loc": ["string", 0],
      "msg": "string",
      "type": "string",
      "input": "string",
      "ctx": {}
    }
  ]
}
```

### `ValidationError`
```json
{
  "loc": ["string", 0],
  "msg": "string",
  "type": "string",
  "input": "string",
  "ctx": {}
}
```
