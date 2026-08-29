# Data model

## Goal
Define a small, explicit schema for Convex so realtime collaboration is clear and reliable.

## Entities

### 1. users
Represents demo participants.

Fields:
- `id`
- `name`
- `role` (`pm`, `designer`, `engineer`, `agent`)
- `avatarUrl` or generated initials/avatar metadata
- `isActive`

### 2. previews
Represents a reviewable product instance.

Fields:
- `id`
- `name`
- `url`
- `projectKey`
- `createdAt`

### 3. threads
Represents a discussion anchored to an element or region.

Fields:
- `id`
- `previewId`
- `title`
- `status` (`open`, `resolved`)
- `anchorType` (`element`, `region`)
- `anchorData` (object)
- `createdByUserId`
- `createdAt`
- `updatedAt`
- `participantIds`
- `actionCount`

### 4. messages
Represents messages inside a thread.

Fields:
- `id`
- `threadId`
- `authorType` (`human`, `agent`, `system`)
- `authorUserId` (nullable for system/agent if desired)
- `content`
- `messageKind` (`question`, `answer`, `reply`, `summary`, `status`)
- `sourceType` (nullable: `repo`, `internal_doc`, `analytics`, `context_dev`, `human`, `system`)
- `sourceMeta` (optional object)
- `createdAt`

### 5. actions
Represents implementation-ready outputs synthesized from threads.

Fields:
- `id`
- `previewId`
- `threadId`
- `title`
- `summary`
- `targetDescription`
- `scopeNotes`
- `acceptanceNotes`
- `status` (`created`)
- `createdAt`

### 6. presence
Tracks active users in the preview/workspace.

Fields:
- `id`
- `previewId`
- `userId`
- `surface` (`playground`, `workspace`)
- `currentRoute`
- `lastSeenAt`

## Seeded demo records
Prepare seeded users:
- PM
- Designer
- Engineer
- Agent (optional as a pseudo-user)

Prepare one seeded preview:
- Malbank / Aql AI demo preview

## Notes
- Keep schema compact.
- Avoid building generalized permissions.
- Use explicit enums instead of free-text statuses.
- Ensure queries are optimized for:
  - all threads by preview
  - messages by thread
  - open thread count
  - resolved thread count
  - actions by preview
  - active participants by preview
