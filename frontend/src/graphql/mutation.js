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

export const EDIT_PROFILE = gql`
  mutation editUser(
    $name: String!,
    $password: String!,
    $newPassword: String,
    $newAvatar: String,
    $newBio: String,
    $newLevel: Int
  ) {
    editUser(data:{
      name: $name,
      password: $password,
      newPassword: $newPassword,
      newAvatar: $newAvatar,
      newBio: $newBio,
      newLevel: $newLevel,
    }) {
      name
      password
      avatar
      bio
      level
    }
  }
`;

export const INITIAL_MY_MAP = gql`
  mutation initialMyMap(
    $name: String!,
    $password: String!,
    $mapName: String!,
    $xLen: Int!,
    $yLen: Int!,
    $zLen: Int!,
  ) {
    initialMyMap(data:{
      name: $name,
      password: $password,
      mapName: $mapName,
      xLen: $xLen,
      yLen: $yLen,
      zLen: $zLen,
    }) {
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

export const DELETE_USER = gql`
  mutation deleteUser(
    $name: String!,
    $password: String!,
  ){
    deleteUser(data:{
      name: $name,
      password: $password,
    }) 
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

