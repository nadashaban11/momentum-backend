# Private Challenges — Decisions

## Explore vs participate
- Anonymous can explore public only (list, details, home, public leaderboard).
- Login required to join, leave, invite, join-by-code.

## Visibility
- Public: discoverable, joinable by ID.
- Private: hidden from lists/home, joinable only via invite code.

## Private access
- Details: public → anyone; private + anon → not found; private + owner/member → allowed; private + stranger → no access.
- Leaderboard: public → anyone; private → owner/member only.
- Direct join by ID: public only.

## Invite code
- One active code per private challenge, auto-issued on create. Public has none.
- Owner only: generate (rotates, kills old code), sees code in details. Members do not see code.
- Invalid code → rejected.
