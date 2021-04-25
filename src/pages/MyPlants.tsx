import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    FlatList,
    Alert
} from 'react-native';
import { PlantProps, loadPlant, removePlant } from '../libs/storage';
import { formatDistance } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Header } from '../components/Header';
import { PlantCardSecondary } from '../components/PlantCardSecondary';
import { Load } from '../components/Load';

import fonts from '../styles/fonts';
import colors from '../styles/colors';
import waterdrop from '../assets/waterdrop.png';

export function MyPlants() {
    const [ myPlants, setMyPlants ] = useState<PlantProps[]>([]);
    const [ loading, setLoading] = useState(true);
    const [ nextWaterd, setNextWaterd] = useState<string>();

    function handleRemove(plant:PlantProps) {
        Alert.alert('Remover', `Deseja remover a ${plant.name}?`,[
            {
                text: ' Não 🙏',
                style: 'cancel'
            },
            {
                text: 'Sim 😯',
                onPress: async () => {
                    try {
                        await removePlant(plant.id);
                        setMyPlants((oldData) => 
                            oldData.filter((item) => item.id != plant.id)
                        );

                    } catch (error){
                        Alert.alert('Não foi possivel remover! 😜');
                    }
                }
            }
        ])
    }

    useEffect(() => {
        async function loadStoredData(){
            try{
                const plantsStored = await loadPlant();

            const nextTime = formatDistance(
                new Date(plantsStored[0].dateTimeNotification).getTime(),
                new Date().getTime(),
                { locale: pt }
            );

            setNextWaterd(
                `Não esqueça de regar a ${plantsStored[0].name} às ${nextTime} horas.`
            )

            setMyPlants(plantsStored);
            setLoading(false);
            }catch{
                Alert.alert('Não há plantas cadastradas;')
                setLoading(false);
            }            
        }

        loadStoredData();
    }, [])

    if(loading)
        return <Load/>

    return ( 
        <View style={styles.container}>
            <Header/>

            <View style={styles.spotligth}>
                <Image 
                    source={waterdrop}
                    style={styles.spotligthImage}
                />

                <Text style={styles.spotligthText}>
                    {nextWaterd}
                </Text>                
            </View>

            <View style={styles.plants}>
                <Text style={styles.plantsTitle}>
                    Próximas regadas
                </Text>

                <FlatList
                    data={myPlants}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({item}) => (
                        <PlantCardSecondary 
                            data={item}
                            handleRemove={() => {handleRemove(item)}}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        backgroundColor: colors.background
    },
    spotligth: {
        backgroundColor: colors.blue_light,
        paddingHorizontal: 20,
        borderRadius: 20,
        height:110,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    spotligthImage: {
        width: 60,
        height: 60
    },
    spotligthText: {
        flex: 1,
        color: colors.blue,
        paddingHorizontal: 20,
        textAlign: 'left'
    },
    plants: {
        flex: 1,
        width: '100%'
    },
    plantsTitle: {
        fontSize: 24,
        fontFamily: fonts.heading,
        color: colors.heading,
        marginVertical: 20
    }
})