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
  query getMap(
    $mapName: String!,
    $username: String!
  ) {
    getMap(data:{
      mapName: $mapName,
      username: $username
    } 
    ){
      xLen
      yLen
      zLen
      mapName
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
`;