import React from 'react'
import { FontAwesome6, Entypo } from '@expo/vector-icons';
import { View, StyleSheet, Text, TouchableOpacity, SafeAreaView, Image, ImageBackground } from 'react-native'

const HomePage = ({navigation}) => {
    const HandleHistory = () => {
        navigation.navigate('History')
    }
    const HandleLoan = () => {
        navigation.navigate('Loan')
    }
    const HandleMorgage = () => {
        navigation.navigate('Mortgage')
    }
    const HandleStdLoan = () => {
        navigation.navigate('StdLoan')
    }
    
    return (
        <ImageBackground source={require('../../assets/bg.png')} style={styles.container} resizeMode='cover'>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <FontAwesome6 name="clock-rotate-left" size={36} color="white" onPress={HandleHistory}/>
                    {/* <FontAwesome6 name="clock-rotate-left" size={36} color="#205781" onPress={HandleHistory}/> */}
                    <Image source={require('../../assets/logo.jpg')} style={{ width: 80, height: 40, borderRadius: 8 }} />
                </View>
                <View style={styles.main}>
                    <View style={styles.headArea}>
                        <Text style={styles.title} >Credit Calculator</Text>
                    </View>
                    <View style={styles.subArea}>
                        <Text style={styles.subtitle} >Choose Calculator</Text>
                        <Text style={styles.description} >Select Type of Loan Calculator</Text>
                        <View style={styles.opt}>
                            <TouchableOpacity style={styles.butType} onPress={HandleLoan}>
                                <Entypo name="credit" size={32} color="white" />
                                <Text style={styles.ttlType}>Loan Calculator</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.butType} onPress={HandleMorgage}>
                                <FontAwesome6 name="suitcase" size={32} color="white" />
                                <Text style={styles.ttlType}>Mortgage</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.butType} onPress={HandleStdLoan}>
                                <FontAwesome6 name="school" size={32} color="white" />
                                <Text style={styles.ttlType}>Student Loan</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View></View>
            </SafeAreaView>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        // backgroundColor: '#205781',
        // backgroundColor: 'white',
        paddingTop: 10,
    },
    header:{
        flexDirection: 'row',
        justifyContent:'space-between',
        marginHorizontal: 20,
        marginTop: 30,
        marginBottom: 15,
    },
    headArea:{
        justifyContent: 'center',
        backgroundColor: '#3674b5',
        width: 260,
        height: 70,
        padding: 18,
        marginTop: 10,
        marginBottom: 20,
        borderTopRightRadius: 16,
        borderBottomRightRadius: 16,
    },
    title: {
        fontSize: 34,
        color: 'white',
        fontFamily: 'Arial',
        fontWeight: '600',
    },
    subArea: {
        marginTop: 30,
        justifyContent: 'center',
        alignItems: 'center',
        height: 'auto',
    },
    subtitle: {
        fontSize: 40,
        color: 'white',
        // color: '#205781',
        marginTop: 10,
        fontFamily: 'Arial',
        textAlign: 'center',
        fontWeight: '700',
    },
    description: {
        fontSize: 24,
        color: 'white',
        
        fontFamily: 'Arial',
        // color: '#205781',
        marginBottom: 20, 
        textAlign: 'center',
    },
    opt:{
        alignItems: 'center',
        marginVertical: 25,
        width: 340,
        margin: 35,
        paddingVertical: 30,
        borderRadius: 24,
    },
    butType:{
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderRadius: 16,
        width: 300,
        height: 70,
        backgroundColor: '#3674b5',
        marginVertical: 10,
        alignItems: 'center',
    },
    ttlType:{
        color: 'white',
        textAlign: 'center',
        fontWeight: '800',
        fontFamily: 'Arial',
        fontSize: 22,
    },
})

export default HomePage
