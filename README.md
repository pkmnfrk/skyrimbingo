Dynamic Skyrim Bingo Card
=========================

This project presents a randomly generated bingo card for The Elder Scrolls V: Skyrim that
can be shared live with other people. It is designed for races or just for a fun thing to
do in Skyrim

It can be accessed at https://bingo.mike-caron.ca.

Note that this tool does not track winners or anything, it is just the card. How you use it
is up to you. For suggestions on how to use it, see below.

How board generation works
--------------------------

1. The generator shuffles the list of built in tasks.
2. Each task is evaluated to see if it has any variance. Eg, "Kill X wolves" has a range of
   possible values. If it does, then a random value in that range is chosen. If the board
   is set to easy or hard, then the value is rolled twice, and the easier/harder value is
   chosen (as appropriate)
3. If the board is set to easy or hard, a maximum difficulty or minimum dificulty are used
   to omit tasks that are too hard or easy, as appropriate. Normal boards are unfiltered
4. The top remaining 25 tasks are assigned to the grid in a left to right, top to bottom
   fashion


How to Play
-----------

1. To generate a new board, click on a difficulty button.
2. If playing in multiplayer, you can share the URL with other players
3. Each player should set a name so they can be tracked properly
4. To mark a row or column as your goal (for purely visual effect), click or tap on a goal
   button. Sorry, no way to mark diagonals yet
5. To advance a task, click or tap on the task. If a task has multiple values, each click
   will advance it by one. Once the value is at maximum, the task will be complete.
6. To unadvance a task, right click or long-press on the task. This will decrement the value
   or just uncomplete it as appropriate

Game suggestions
----------------

**Traditional Bingo**

1. All players have a different card.
2. Play proceeds, each player marking tasks as they go
3. The first player to fill a previously agreed on number of rows and columns is the winner

**Speedrunner Bingo**

1. All players use the _same_ card, so they have the same tasks to complete
2. Play proceeds as in regular bingo

**Lockout Bingo**

1. This is for two people only
2. Both players use the same card, with Lockout mode enabled
3. When a task is completed by a player, it cannot be completed by the other
4. The first player to complete 13 goals is the winner
