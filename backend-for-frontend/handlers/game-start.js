export const getGameStart = (req, res) => {
  const id = req.params.id;
  res.status(200).write('idk, do something ¯\\_(ツ)_/¯');
  res.end(`btw, the game id is ${id}`);
};

export const postGameStart = (req, res) => {
  // TODO post back-end game start

  // just to replicate a timeous response lol... better ux fr fr
  setTimeout(() => {
    res.status(200).end();
  }, 1000);
};
