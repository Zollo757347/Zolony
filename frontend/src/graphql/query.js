import { gql } from '@apollo/client';

export const LOG_IN = gql`
  query login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      error
      data {
        username
        avatar
        bio
        level
        maps
      }
    }
  }
`;

export const GET_MAP =  gql`
  query getMap($username: String!, $mapName: String!) {
    getMap(username: $username, mapName: $mapName) {
      error
      data {
        xLen
        yLen
        zLen
        mapName
        availableBlocks
        validation {
          levers
          lamps
          boolFuncs
          timeout
        }
        playground {
          type
          breakable
          states {
            power 
            source

            delay
            facing
            face
            locked
            powered

            lit

            east
            south
            west
            north
          }
        }
      }
    }
  }
`;