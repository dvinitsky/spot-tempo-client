import React from "react";
import Song from "./Song";
import styled from "styled-components";
import { Text } from "react-native";

const Header = styled.View`
  text-align: center;
  font-size: 20px;
`;
const List = styled.View`
  width: 350px;
`;

export const SongList = ({ label, shiftSong, listName, songs }) => (
  <List>
    <Header>
      <Text>{label}</Text>
    </Header>
    {songs.map((song, index) => (
      <Song
        key={index}
        song={song}
        shiftSong={shiftSong}
        listName={listName}
        index={index}
      />
    ))}
  </List>
);

export default SongList;
