import { gql } from '@apollo/client';

export const LOG_IN = gql`
    query logIn(
        $name: String!,
        $password: String!
    ) {
        logIn(data:{
            name: $name,
            password: $password
        }){
            name
            password
            avatar
            bio
            level
            maps {
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

export const GET_MAP =  gql`
    query getMap(
        $mapName: String!,
        $name: String!
    ) {
        getMap(data:{
            mapName: $mapName,
            name: $name
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