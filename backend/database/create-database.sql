CREATE TABLE `game_object_types` (
  `type_id` integer AUTO_INCREMENT,
  `type_name` varchar(255),
  PRIMARY KEY (type_id)
);

CREATE TABLE `game_objects` (
  `object_id` integer AUTO_INCREMENT,
  `object_type_id` integer,
  `object_description` varchar(255),
  PRIMARY KEY (object_id)
);

CREATE TABLE `player_games` (
  `player_game_id` integer AUTO_INCREMENT,
  `player_id` integer,
  `game_id` integer,
  `character_id` integer,
  PRIMARY KEY (player_game_id)
);

CREATE TABLE `players` (
  `player_id` integer AUTO_INCREMENT,
  `player_username` varchar(255),
  PRIMARY KEY (player_id)
);

CREATE TABLE `game_cards` (
  `player_game_id` integer,
  `game_object_id` integer
);

CREATE TABLE `case_file_confidential` (
  `game_id` integer AUTO_INCREMENT,
  `suspect_id` integer,
  `weapon_id` integer,
  `room_id` integer,
  PRIMARY KEY (game_id)
);

ALTER TABLE `game_objects` ADD FOREIGN KEY (`object_type_id`) REFERENCES `game_object_types` (`type_id`);

ALTER TABLE `player_games` ADD FOREIGN KEY (`player_id`) REFERENCES `players` (`player_id`);

ALTER TABLE `player_games` ADD FOREIGN KEY (`character_id`) REFERENCES `game_objects` (`object_id`);

ALTER TABLE `game_cards` ADD FOREIGN KEY (`player_game_id`) REFERENCES `player_games` (`player_game_id`);

ALTER TABLE `game_cards` ADD FOREIGN KEY (`game_object_id`) REFERENCES `game_objects` (`object_id`);

ALTER TABLE `case_file_confidential` ADD FOREIGN KEY (`suspect_id`) REFERENCES `game_objects` (`object_id`);

ALTER TABLE `case_file_confidential` ADD FOREIGN KEY (`weapon_id`) REFERENCES `game_objects` (`object_id`);

ALTER TABLE `case_file_confidential` ADD FOREIGN KEY (`room_id`) REFERENCES `game_objects` (`object_id`);
