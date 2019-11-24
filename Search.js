import React, { useState, useEffect } from "react";
import { SongList } from "./SongList";
import styled from "styled-components";
import Axios from "axios";
import { Text, Button } from "react-native";
import { serverUrl } from "./constants/constants";

const Wrapper = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Title = styled.Text`
  font-size: 25px;
`;
const HeaderText = styled.Text`
  text-align: center;
  color: white;
  margin: 20px 60px;
`;
const SearchBar = styled.TextInput`
  font-size: 24px;
  margin-right: 20px;
`;
const SearchArea = styled.View`
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
`;
const ListsContainer = styled.View`
  display: flex;
  justify-content: center;
`;

const Search = () => {
  const [destinationSongs, setDestinationSongs] = useState([]);
  const [originSearchResults, setOriginSearchResults] = useState([]);
  const [bpm, setBpm] = useState();
  const [isLoading, setIsLoading] = useState();

  useEffect(() => {
    const getInitialSongs = async () => {
      setIsLoading(true);

      const firstOriginBatch = await Axios.post(
        `${serverUrl}/getNextOriginSongs`,
        {
          start: 0,
          end: 100
        }
      );
      const firstDestinationBatch = await Axios.post(
        `${serverUrl}/getNextDestinationSongs`,
        {
          start: 0,
          end: 100
        }
      );

      setOriginSearchResults(firstOriginBatch.data);
      setDestinationSongs(firstDestinationBatch.data);

      setIsLoading(false);
    };

    getInitialSongs();
  }, []);

  const handleSearch = async () => {
    const newBpm = document.getElementById("searchbar").value;

    const matchingTracks = await Axios.post(`${serverUrl}/getMatchingSongs`, {
      bpm: newBpm,
      start: 0,
      end: 100
    });

    setBpm(newBpm);
    setOriginSearchResults(matchingTracks.data);
  };

  const addSongToDestination = async song => {
    try {
      await Axios.post(`${serverUrl}/addTrack`, {
        trackId: song.uri
      });
      setDestinationSongs([...destinationSongs, song]);
      setOriginSearchResults(
        originSearchResults.filter(item => item.id !== song.id)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const removeSongFromDestination = async (song, position) => {
    try {
      await Axios.post(`${serverUrl}/removeTrack`, {
        trackId: song.uri,
        position
      });

      setDestinationSongs(
        destinationSongs.filter(
          (track, index) => track.id !== song.id && index !== position
        )
      );
      if (song.tempo > bpm - 5 && song.tempo < bpm + 5) {
        setOriginSearchResults([...originSearchResults, song]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Wrapper>
      <Title>Spotify BPM Picker</Title>
      <HeaderText>
        This app will allow you to search for songs by BPM in your "SpotTempo"
        playlist, and add them to your "SpotTempo Workout" playlist.
      </HeaderText>

      <SearchArea>
        <SearchBar
          id="searchbar"
          type="text"
          onKeyDown={e => {
            if (e.keyCode === 13) {
              handleSearch();
            }
          }}
        />
        <Button title="Search" onClick={handleSearch}>
          <Text>Search</Text>
        </Button>
      </SearchArea>

      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <ListsContainer>
          <SongList
            label="Search Results from SpotTempo playlist (limit 100)"
            songs={originSearchResults}
            shiftSong={addSongToDestination}
            listName="searchResults"
          />

          <SongList
            label="SpotTempo Workout playlist"
            songs={destinationSongs}
            shiftSong={removeSongFromDestination}
            listName="playlist"
          />
        </ListsContainer>
      )}
    </Wrapper>
  );
};
export default Search;
