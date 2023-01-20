import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation createUser($username: String!, $password: String!) {
    createUser(username: $username, password: $password) {
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

export const EDIT_USER = gql`
  mutation editUser($data: EditUserInput!) {
    editUser(data: $data) {
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

export const DELETE_USER = gql`
  mutation deleteUser($username: String!, $password: String!) {
    deleteUser(username: $username, password: $password) {
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

export const CREATE_MAP = gql`
  mutation createMap($username: String!, $data: CreateMapInput!) {
    createMap(username: $username, data: $data) {
      error
      data {
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
          }
        }
      }
    }
  }
`;

export const EDIT_MY_MAP = gql`
  mutation editMyMap(
    $name: String!,
    $password: String!,
    $mapName: String!,
    $map: MapDataInput!
  ) {
    editMyMap(data:{
      name: $name,
      password: $password,
      mapName: $mapName,
      map: $map
    }) {
      mapName
      xLen
      yLen
      zLen
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
`;

export const DELETE_USER_MAP = gql`
  mutation deleteUserMap(
    $name: String!,
    $password: String!,
    $mapName: String!,
  ) {
    deleteUserMap(data:{
      name: $name,
      password: $password,
      mapName: $mapName
    })
  }
`;

