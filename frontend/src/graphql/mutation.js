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

export const EDIT_MAP = gql`
  mutation editMap($username: String!, $data: EditMapInput!) {
    editMap(username: $username, data: $data) {
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
        availableBlocks
        validation {
          levers
          lamps
          boolFuncs
          timeout
        }
      }
    }
  }
`;

export const DELETE_MAP = gql`
  mutation deleteMap($username: String!, $mapName: String!) {
    deleteMap(username: $username, mapName: $mapName) {
      error
    }
  }
`;

