---
name: synergy-check
description: Verify all system synergies are working. Use when asked to check connections between Pipeline, Finance, Email, Calendar, Notifications, Production.
allowed-tools: Read, Grep, Glob
---
# Synergy Health Check

## Verify these connections:

### Pipeline → Finance
- [ ] Prospect "Signé" triggers invoice notification
- [ ] Notification links to /finance

### Email → Calendar
- [ ] Email sent triggers J+7 follow-up reminder
- [ ] Reminder links to /calendrier

### Video → Notification
- [ ] Video created triggers production notification

### Contacts → Notification
- [ ] Contact added triggers prospect notification

### Calendar → Notification
- [ ] Event created triggers reminder

### Production → Finance
- [ ] Completed production updates CA projections

## Check implementation:
1. Search for `triggerSynergy` calls across the codebase
2. Search for `createNotification` calls
3. Verify notification types match: prospect, invoice, system, agent, alert, reminder
4. Check that toast feedback exists on every Supabase write

## Report format:
| Synergy | Status | File | Line |
|---|---|---|---|
| Pipeline→Finance | ✅/❌ | path | line |
