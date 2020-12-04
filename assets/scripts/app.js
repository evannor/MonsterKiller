const ATTACK_VALUE = 10;
const MONSTER_ATTACK_VALUE = 14;
const STRONG_ATTACK_VALUE = 17;
const HEAL_VALUE = 20;

// utilizing global constants as identifiers in conditional code
const MODE_ATTACK = "ATTACK"; // MODE_ATTACK = 0
const MODE_STRONG_ATTACK = "STRONG_ATTACK"; // MODE_ATTACK_STRONG = 1
const LOG_EVENT_PLAYER_ATTACK = "PLAYER_ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_GAME_OVER = "GAME_OVER";

// changed camel casing to all caps to blatantly confirm that this is a global value that will not be changed
// Prompt user to enter in a value and save it
const enteredValue = prompt(
  "What would you like the maximum life of you and the monster to be?",
  "100"
);
let chosenMaxLife = parseInt(enteredValue);

if (isNaN(chosenMaxLife) || chosenMaxLife <= 0) {
  chosenMaxLife = 100;
}
adjustHealthBars(chosenMaxLife);

let battleLog = [];

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", attackHandler);
healBtn.addEventListener("click", healPlayerHandler);
logBtn.addEventListener("click", printLogHandler);

function writeToLog(event, value, monsterHealth, playerHealth) {
  let logEntry = {
    event: event,
    value: value,
    finalMonsterHealth: monsterHealth,
    finalPlayerHealth: playerHealth,
  };
  if (event === LOG_EVENT_PLAYER_ATTACK) {
    logEntry.target = "MONSTER";
  } else if (event === LOG_EVENT_PLAYER_STRONG_ATTACK) {
    logEntry.target = "MONSTER";
  } else if (event === LOG_EVENT_MONSTER_ATTACK) {
    logEntry.target = "PLAYER";
  } else if (event === LOG_EVENT_PLAYER_HEAL) {
    logEntry.target = "PLAYER";
  } else if (event === LOG_EVENT_GAME_OVER) {
    logEntry.target = "NONE";
  }
  battleLog.push(logEntry);
}

function printLogHandler() {
  console.log(battleLog);
}

function reset() {
  // does not include gaining bonus life back, would need to write that functionality on my own
  currentMonsterHealth = chosenMaxLife;
  currentPlayerHealth = chosenMaxLife;
  resetGame(chosenMaxLife);
}

function healPlayerHandler() {
  let healValue;
  if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
    alert("You can't heal more than your max life!");
    healValue = chosenMaxLife - currentPlayerHealth;
  } else {
    healValue = HEAL_VALUE;
  }
  increasePlayerHealth(healValue);
  currentPlayerHealth += healValue;
  writeToLog(
    LOG_EVENT_PLAYER_HEAL,
    healValue,
    currentMonsterHealth,
    currentPlayerHealth
  );
  endRound();
}

function attackMonster(mode) {
  const maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
  const logEvent =
    logEvent === MODE_ATTACK
      ? LOG_EVENT_PLAYER_ATTACK
      : LOG_EVENT_PLAYER_STRONG_ATTACK;

  // if (mode === MODE_ATTACK) {
  //   maxDamage = ATTACK_VALUE;
  //   logEvent = LOG_EVENT_PLAYER_ATTACK;
  // } else if (mode === MODE_STRONG_ATTACK) {
  //   maxDamage === STRONG_ATTACK_VALUE;
  //   logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
  // }
  const monsterDamage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= monsterDamage;
  writeToLog(
    logEvent,
    monsterDamage,
    currentMonsterHealth,
    currentPlayerHealth
  );
  endRound();
}

function endRound() {
  const initialPlayerHealth = currentPlayerHealth;
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;
  writeToLog(
    LOG_EVENT_MONSTER_ATTACK,
    playerDamage,
    currentMonsterHealth,
    currentPlayerHealth
  );

  if (currentPlayerHealth <= 0 && hasBonusLife) {
    hasBonusLife = false;
    removeBonusLife();
    currentPlayerHealth = initialPlayerHealth;
    alert("You would be dead, but the bonus life save you!");
    setPlayerHealth(initialPlayerHealth);
  }
  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert("You won!!");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "PLAYER WON!",
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert("You lost!");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "MONSTER WON!",
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
    alert("We have a draw!");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "A DRAW",
      currentMonsterHealth,
      currentPlayerHealth
    );
  }

  if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
    reset();
  }
}

function attackHandler() {
  attackMonster(MODE_ATTACK);
}
function strongAttackHandler() {
  attackMonster(MODE_STRONG_ATTACK);
}

// This is my attempt to refactor the code w/out seeing the answer first. The above code is used to match future updates as the lectures progress
// function attackHandler() {
//   damage(ATTACK_VALUE);
//   winScenario(currentMonsterHealth, currentPlayerHealth);
// }
// function strongAttackHandler() {
//   damage(STRONG_ATTACK_VALUE);
//   winScenario(currentMonsterHealth, currentPlayerHealth);
// }
// function winScenario(playerHealth, monsterHealth) {
//   if (monsterHealth <= 0 && playerHealth > 0) {
//     alert("You won!!");
//   } else if (playerHealth <= 0 && monsterHealth > 0) {
//     alert("You lost!");
//   } else if (playerHealth <= 0 && monsterHealth <= 0) {
//     alert("We have a draw!");
//   }
// }
// function damage(playerAttack) {
//   const monsterDamage = dealMonsterDamage(playerAttack);
//   currentMonsterHealth -= monsterDamage;
//   const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
//   currentPlayerHealth -= playerDamage;
// }
