import Redis from "ioredis";

const redis = new Redis();

export async function createGlobalHashmap() {
  //create a dummy entry in the global hashmap
  redis.hset(
    `GlobalHashMap:Hashmap1`,
    "player1Email",
    "example1@email.com",
    "player2Email",
    "another1@example.com",
    "boardState",
    "your_board_state1"
  );
}

export async function addGameInRedis(email1) {
  // TODO: set expiry time for created game
  if ((await redis.hget(`GlobalHashMap:${email1}`, `player1Email`)) === null) {
    await redis.hset(
      `GlobalHashMap:${email1}`,
      "player1Email",
      `${email1}`,
      "player2Email",
      ``,
      "boardState",
      ``,
      `isActive`,
      ``,
      `hostColor`,
      ``
    );
  } else {
    console.log("game already exists");
  }
}

export async function setHostColor(innerHashID, color) {
  await redis.hset(`GlobalHashMap:${innerHashID}`, `hostColor`, `${color}`);
}

export async function setSecondPlayer(innerHashID, email2) {
  await redis.hset(`GlobalHashMap:${innerHashID}`, `player2Email`, `${email2}`);
}

export async function updateBoardState(innerHashID, boardState) {
  try {
    await redis.hset(
      `GlobalHashMap:${innerHashID}`,
      "boardState",
      JSON.stringify(boardState)
    );
    console.log(`Board state updated successfully for ${innerHashID}`);
  } catch (error) {
    console.error(`Error updating board state for ${innerHashID}:`, error);
  }
}

createGlobalHashmap();

// Testing the functions
async function testFunctions() {
  await addGameInRedis("apoorvavpendse@gmail.com");

  console.log("setting host color");
  await setHostColor("apoorvavpendse@gmail.com", "white");

  console.log("setting player2 email");
  await setSecondPlayer("apoorvavpendse@gmail.com", "ganesh@gmail.com");

  console.log("updating board state", { a: 12, b: "apple", c: true });
  await updateBoardState("apoorvavpendse@gmail.com", {
    a: 12,
    b: "apple",
    c: true,
  });

  let boardState = await redis.hget(
    "GlobalHashMap:apoorvavpendse@gmail.com",
    "boardState"
  );
  console.log(JSON.parse(boardState));
}

testFunctions();