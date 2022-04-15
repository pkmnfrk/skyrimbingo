const goals = [
    {
        "goal": "Activate a standing stone (other than the first three)",
        "mindifficulty": 2,
        "maxdifficulty": 2
    },
    {
        "goal": "Adopt a child",
        "mindifficulty": 2,
        "maxdifficulty": 2
    },
    {
        "goal": "Be eaten by a dragon",
        "note": "Ideally the kill-cam, but being bitten works too",
        "mindifficulty": 2,
        "maxdifficulty": 2
    },
    {
        "goal": "Be killed by a Dwarven Centurion",
        "mindifficulty": 2,
        "maxdifficulty": 2
    },
    {
        "goal": "Become a vampire",
        "mindifficulty": 3,
        "maxdifficulty": 3
    },
    {
        "goal": "Become overburdened",
        "mindifficulty": 1,
        "maxdifficulty": 1
    },
    {
        "goal": "Become Thane of {} hold(s)",
        "mindifficulty": 2,
        "maxdifficulty": 4,
        "minvalue": 1,
        "maxvalue": 3,
        "incremental": true
    },
    {
        "goal": "Brew a potion worth at least {} Septims",
        "mindifficulty": 1,
        "maxdifficulty": 4,
        "minvalue": 200,
        "maxvalue": 1000,
        "stepvalue": 200
    },
    {
        "goal": "Brew an invisibility potion",
        "mindifficulty": 3,
        "maxdifficulty": 3
    },
    {
        "goal": "Build a house that you can enter",
        "note": "As in, it has a loading zone to the interior",
        "mindifficulty": 3,
        "maxdifficulty": 3
    },
    {
        "goal": "Buy a horse",
        "mindifficulty": 2,
        "maxdifficulty": 2
    },
    {
        "goal": "Cast an Apprentice-level spell",
        "mindifficulty": 2,
        "maxdifficulty": 2
    },
    {
        "goal": "Cast an Expert-level spell",
        "mindifficulty": 3,
        "maxdifficulty": 3
    },
    {
        "goal": "Clear {} dungeons",
        "mindifficulty": 2,
        "maxdifficulty": 4,
        "minvalue": 3,
        "maxvalue": 10,
        "incremental": true
    },
    {
        "goal": "Complete {} jobs for the Thieves Guild",
        "note": "The radiant quests given to you by Vex/Delvin",
        "mindifficulty": 3,
        "maxdifficulty": 4,
        "minvalue": 3,
        "maxvalue": 6,
        "incremental": true
    },
    {
        "goal": "Complete {} miscellaneous quests",
        "mindifficulty": 2,
        "maxdifficulty": 4,
        "minvalue": 3,
        "maxvalue": 8,
        "incremental": true
    },
    {
        "goal": "Complete the quest \"Diplomatic Immunity\"",
        "note": "Part of the Main Questline",
        "mindifficulty": 3,
        "maxdifficulty": 3
    },
    {
        "goal": "Complete the quest \"The Way of the Voice\"",
        "note": "Part of the Main Questline",
        "mindifficulty": 2,
        "maxdifficulty": 2
    },
    {
        "goal": "Complete three contracts for the Dark Brotherhood",
        "mindifficulty": 3,
        "maxdifficulty": 3
    },
    {
        "goal": "Contract a disease",
        "mindifficulty": 2,
        "maxdifficulty": 2
    },
    {
        "goal": "Cook {} different food items",
        "mindifficulty": 2,
        "maxdifficulty": 3,
        "minvalue": 4,
        "maxvalue": 12,
        "stepvalue": 2,
        "incremental": true
    },
    {
        "goal": "Discover {} hold capital(s)",
        "mindifficulty": 1,
        "maxdifficulty": 2,
        "minvalue": 2,
        "maxvalue": 7,
        "incremental": true
    },
    {
        "goal": "Discover {} map marker(s)",
        "mindifficulty": 2,
        "maxdifficulty": 4,
        "minvalue": 10,
        "maxvalue": 50,
        "stepvalue": 5,
        "incremental": true
    },
    {
        "goal": "Discover {} non-captial cities",
        "mindifficulty": 2,
        "maxdifficulty": 3,
        "minvalue": 2,
        "maxvalue": 6,
        "incremental": true
    },
    {
        "goal": "Discover Castle Volkhair",
        "mindifficulty": 2,
        "maxdifficulty": 2
    },
    {
        "goal": "Discover Fort Dawnguard",
        "mindifficulty": 2,
        "maxdifficulty": 2
    },
    {
        "goal": "Drink a bottle of Black Briar Mead",
        "mindifficulty": 1,
        "maxdifficulty": 1
    },
    {
        "goal": "Get arrested in {} different holds",
        "mindifficulty": 1,
        "maxdifficulty": 2,
        "minvalue": 2,
        "maxvalue": 4,
        "incremental": true
    },
    {
        "goal": "Get married",
        "mindifficulty": 1,
        "maxdifficulty": 1
    },
    {
        "goal": "Give a coin to {} different beggars",
        "mindifficulty": 1,
        "maxdifficulty": 2,
        "minvalue": 2,
        "maxvalue": 5,
        "incremental": true
    },
    {
        "goal": "Have {} Septims at one time",
        "mindifficulty": 2,
        "maxdifficulty": 4,
        "minvalue": 2500,
        "maxvalue": 20000,
        "stepvalue": 2500
    },
    {
        "goal": "Have a bounty of at least {} Septims without murder",
        "mindifficulty": 2,
        "maxdifficulty": 3,
        "minvalue": 500,
        "maxvalue": 2000,
        "stepvalue": 250
    },
    {
        "goal": "Have a bounty of at least 200 Septims in {} holds",
        "mindifficulty": 2,
        "maxdifficulty": 3,
        "minvalue": 2,
        "maxvalue": 4,
        "incremental": true
    },
    {
        "goal": "Have a guard comment on a skill",
        "note": "Requires a skill level of 30",
        "mindifficulty": 3,
        "maxdifficulty": 3
    },
    {
        "goal": "Join an army",
        "note": "Imperial Legion or Stormcloaks",
        "mindifficulty": 2,
        "maxdifficulty": 2
    },
    {
        "goal": "Join the Bards College",
        "note": "Complete the quest \"Tending the Flames\"",
        "mindifficulty": 3,
        "maxdifficulty": 3
    },
    {
        "goal": "Join the College of Winterhold",
        "note": "Complete the quest \"First Lessons\"",
        "mindifficulty": 2,
        "maxdifficulty": 2
    },
    {
        "goal": "Join the Companions",
        "note": "Complete the quest \"Take Up Arms\"",
        "mindifficulty": 1,
        "maxdifficulty": 1
    },
    {
        "goal": "Join the Dark Brotherhood",
        "note": "Complete the quest \"With Friends Like These...\"",
        "mindifficulty": 2,
        "maxdifficulty": 2
    },
    {
        "goal": "Join the Thieves Guild",
        "note": "Complete the quest \"Taking Care of Business\" and talk to Mercer afterwards",
        "mindifficulty": 1,
        "maxdifficulty": 1
    },
    {
        "goal": "Kill {} bear(s)",
        "mindifficulty": 2,
        "maxdifficulty": 3,
        "minvalue": 2,
        "maxvalue": 4,
        "incremental": true
    },
    {
        "goal": "Kill {} dragon(s)",
        "mindifficulty": 3,
        "maxdifficulty": 4,
        "minvalue": 1,
        "maxvalue": 3,
        "incremental": true
    },
    {
        "goal": "Kill {} guard(s)",
        "mindifficulty": 3,
        "maxdifficulty": 4,
        "minvalue": 1,
        "maxvalue": 3,
        "incremental": true
    },
    {
        "goal": "Kill {} wolves",
        "mindifficulty": 1,
        "maxdifficulty": 2,
        "minvalue": 3,
        "maxvalue": 10,
        "incremental": true
    },
    {
        "goal": "Kill a civilian without getting caught",
        "mindifficulty": 3,
        "maxdifficulty": 3
    },
    {
        "goal": "Kill a member of the Thalmor",
        "mindifficulty": 2,
        "maxdifficulty": 2
    },
    {
        "goal": "Kill an Argonian, Kahjiit and Orc bandit",
        "mindifficulty": 2,
        "maxdifficulty": 2
    },
    {
        "goal": "Kill Nazeem without getting caught",
        "mindifficulty": 2,
        "maxdifficulty": 2
    },
    {
        "goal": "Learn {} Alteration Spells",
        "mindifficulty": 2,
        "maxdifficulty": 3,
        "minvalue": 2,
        "maxvalue": 5,
        "incremental": true
    },
    {
        "goal": "Learn {} different enchantments",
        "mindifficulty": 2,
        "maxdifficulty": 4,
        "minvalue": 3,
        "maxvalue": 10,
        "incremental": true
    },
    {
        "goal": "Learn shouts from {} dragon wall(s)",
        "mindifficulty": 3,
        "maxdifficulty": 4,
        "minvalue": 2,
        "maxvalue": 5,
        "incremental": true
    },
    {
        "goal": "Legendary a skill",
        "mindifficulty": 5,
        "maxdifficulty": 5
    },
    {
        "goal": "Mine from {} different ore veins",
        "mindifficulty": 1,
        "maxdifficulty": 2,
        "minvalue": 3,
        "maxvalue": 10,
        "incremental": true
    },
    {
        "goal": "Obtain {} daedric artifact(s)",
        "mindifficulty": 3,
        "maxdifficulty": 4,
        "minvalue": 2,
        "maxvalue": 4,
        "incremental": true
    },
    {
        "goal": "Obtain {} East Empire Pendant(s)",
        "mindifficulty": 2,
        "maxdifficulty": 3,
        "minvalue": 1,
        "maxvalue": 3,
        "incremental": true
    },
    {
        "goal": "Obtain {} Elder Scroll(s)",
        "mindifficulty": 4,
        "maxdifficulty": 6,
        "minvalue": 1,
        "maxvalue": 3,
        "incremental": true
    },
    {
        "goal": "Obtain {} flawless gem(s)",
        "mindifficulty": 2,
        "maxdifficulty": 4,
        "minvalue": 1,
        "maxvalue": 5,
        "incremental": true
    },
    {
        "goal": "Obtain {} samples of Nirnroot",
        "mindifficulty": 2,
        "maxdifficulty": 3,
        "minvalue": 3,
        "maxvalue": 7,
        "incremental": true
    },
    {
        "goal": "Obtain {} sweetrolls",
        "mindifficulty": 1,
        "maxdifficulty": 3,
        "minvalue": 5,
        "maxvalue": 15,
        "incremental": true
    },
    {
        "goal": "Obtain {} Unusual Gems",
        "mindifficulty": 1,
        "maxdifficulty": 3,
        "minvalue": 2,
        "maxvalue": 9,
        "incremental": true
    },
    {
        "goal": "Obtain a Black Book boon",
        "mindifficulty": 4,
        "maxdifficulty": 4
    },
    {
        "goal": "Obtain a Fire, Ice and Light(ning) arrow",
        "mindifficulty": 2,
        "maxdifficulty": 2
    },
    {
        "goal": "Obtain a piece of Ebony ore",
        "mindifficulty": 2,
        "maxdifficulty": 2
    },
    {
        "goal": "Obtain a piece of Glass armor",
        "mindifficulty": 3,
        "maxdifficulty": 3
    },
    {
        "goal": "Obtain a Superior quality item",
        "mindifficulty": 3,
        "maxdifficulty": 3
    },
    {
        "goal": "Own {} properties",
        "note": "Houses or Hearthfire plots (empty is fine)",
        "mindifficulty": 2,
        "maxdifficulty": 4,
        "minvalue": 1,
        "maxvalue": 3,
        "incremental": true
    },
    {
        "goal": "Punch a Jarl",
        "mindifficulty": 1,
        "maxdifficulty": 1
    },
    {
        "goal": "Reach Level {}",
        "mindifficulty": 2,
        "maxdifficulty": 4,
        "minvalue": 5,
        "maxvalue": 20,
        "stepvalue": 5
    },
    {
        "goal": "Reach Level {} in a skill",
        "mindifficulty": 3,
        "maxdifficulty": 5,
        "minvalue": 30,
        "maxvalue": 50,
        "stepvalue": 5
    },
    {
        "goal": "Read {} skill book(s)",
        "mindifficulty": 2,
        "maxdifficulty": 4,
        "minvalue": 5,
        "maxvalue": 15,
        "incremental": true
    },
    {
        "goal": "Resolve the Civil War",
        "mindifficulty": 5,
        "maxdifficulty": 5
    },
    {
        "goal": "Successfully pickpocket {} different people",
        "mindifficulty": 2,
        "maxdifficulty": 3,
        "minvalue": 4,
        "maxvalue": 10,
        "incremental": true
    },
    {
        "goal": "Travel on foot from Whiterun to Markarth",
        "note": "No fast travel, horses or carriage",
        "mindifficulty": 2,
        "maxdifficulty": 2
    }
];

export { goals };
