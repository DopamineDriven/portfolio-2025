### TODO

Accessibility: Ensure that the navigation controls are keyboard accessible and properly labeled for screen readers. You can add `aria-label` attributes to the navigation buttons to describe their function.
Analysis mode: You could implement an analysis mode where players can freely navigate through the game history and explore alternative moves without affecting the actual game state.
Export game: Add a feature to export the game in PGN (Portable Game Notation) format, allowing players to save and share their games.


handle the `makeMove` invalid move handling when a user is going through history 
set a boolean to the global context to change how moves are processed when a user is paging through history and revisiting previous moves made (inspecting things like the best move path with the lightbulb icon and so on)

we should also consider changing the viewOnly field in the config for the board (in Chessboard.tsx) that is wrapped in a useEffect hook to be equal to `true` when a user is navigating history and a stateful global context value reflects that  and `false` once a user has returned to the current position of the game once more. 
Error: Invalid move: {"color":"b","piece":"n","from":"b8","to":"c6","san":"Nc6","flags":"n","lan":"b8c6","before":"rnbqkbnr/ppp1ppp1/7p/1B1p4/3P4/4P3/PPP2PPP/RNBQK1NR b KQkq - 1 3","after":"r1bqkbnr/ppp1ppp1/2n4p/1B1p4/3P4/4P3/PPP2PPP/RNBQK1NR w KQkq - 2 4"}
