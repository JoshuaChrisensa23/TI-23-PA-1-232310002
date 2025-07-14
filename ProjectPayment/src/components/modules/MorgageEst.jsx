import React from 'react'
import { FontAwesome6 } from '@expo/vector-icons';
import { KeyboardAvoidingView, Text, SafeAreaView, TextInput, View, StyleSheet, TouchableOpacity, ScrollView, Platform, Image, ImageBackground, Alert } from 'react-native'
import { saveToHistory } from '../logic/HistoryStorage';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useRoute } from '@react-navigation/native';

const screenWidth = Dimensions.get("window").width;


const MorgageEst = ({navigation}) => {
  const route = useRoute();
  const [price, setPrice] = React.useState(route.params?.loanAmount || '')
  const [interestRate, setInterestRate] = React.useState(route.params?.interestRate || '')
  const [loanTerm, setLoanTerm] = React.useState(route.params?.loanTerm || '')
  const [downPay, setdownPay] = React.useState(route.params?.downPay || '')
  const [result, setResult] = React.useState('');
  const [result1, setResult1] = React.useState('');
  const [chart,setChart] = React.useState([]);
  
  const form = [
    {key: "price", label: "Property Price ($)", placeholder1: "e.g. 10000"},
    {key: "rate", label: "Interest Rate (%)", placeholder1: "%"},
    {key: "term", label: "Loan Terms (Year)", placeholder1: "Years"},
    {key: "DP", label: "Down Payment (%)", placeholder1: "%"},
  ];
  
  const calculate = () => {

    if (!price || !interestRate || !loanTerm || !downPay) {
      Alert.alert('Input Error', 'Please fill in all fields.');
      setResult('');
      setResult1('');
      setChart([]);
      return;
    }

    const propertyPrice = parseFloat(price) || 0;
    const rate = parseFloat(interestRate) || 0;
    const termYears = parseFloat(loanTerm) || 0;
    const dpPercent = parseFloat(downPay) || 0;

    const downPaymentAmount = (dpPercent / 100) * propertyPrice;
    const loanAmount = propertyPrice - downPaymentAmount;
    const monthlyInterestRate = rate / 100 / 12;
    const numberOfMonths = termYears * 12;

    let monthlyPayment = 0;
    if (monthlyInterestRate === 0) {
      monthlyPayment = loanAmount / numberOfMonths;
    } else {
      monthlyPayment = loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfMonths)) / (Math.pow(1 + monthlyInterestRate, numberOfMonths) - 1);
    }

    const balances = [];
    let balance = loanAmount;
    const totalRepayment = monthlyPayment * (termYears * 12);
    const totalInterest = totalRepayment - loanAmount;

    for (let year = 1; year <= termYears; year++) {
      for (let month = 0; month < 12; month++) {
        const interest = balance * monthlyInterestRate;
        const principal = monthlyPayment - interest;
        balance -= principal;
        if (balance < 0) balance = 0;
      }
      balances.push(Number(balance.toFixed(2)));
    }

    const cleanedBalances = balances.map( val =>isFinite(val) && !isNaN(val) ? val : 0 );

    const chartData = balances.map(val => {
      const num = Number(val);
      return isFinite(num) && !isNaN(num) ? num : 0;
    });

    setResult(`Property Price: $${formatCurrency(propertyPrice.toFixed(2))},\t Down Payment: $${formatCurrency(downPaymentAmount.toFixed(2))},\t Loan Term: ${termYears} Yrs`);
    setResult1(`Total Interest: $${formatCurrency(totalInterest)},\t Loan Amount: $${formatCurrency(loanAmount.toFixed(2))},\t Total Repayment: $${formatCurrency(totalRepayment.toFixed(2))}`);
    setChart(cleanedBalances);

    const entry = {
      category: 'mortgage',
      price,
      interestRate,
      loanTerm,
      downPay,
      result: `Property Price: $${formatCurrency(propertyPrice.toFixed(2))},\t Down Payment: $${formatCurrency(downPaymentAmount.toFixed(2))},\t Loan Term: ${termYears} Yrs`,
      result1: `Total Interest: $${formatCurrency(totalInterest)},\t Loan Amount: $${formatCurrency(loanAmount.toFixed(2))},\t Total Repayment: $${formatCurrency(totalRepayment.toFixed(2))}`,
      chart: chartData
    };
    
    saveToHistory(entry);
  };

  const handleBack = () =>{
    navigation.navigate('Home');
  }

  const formatCurrency = (num) => {
    if (typeof num !== 'number') num = Number(num);
    return isNaN(num) ? '0' : num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
      <ImageBackground source={require('../../../assets/bg.png')} style={{ flex: 1 }} resizeMode='cover'>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <FontAwesome6 name="house" size={36} color="white" onPress={handleBack}/>
          <Image source={require('../../../assets/logo.jpg')} style={{ width: 90, height: 40, borderRadius: 8 }} />
        </View>
        <View style={styles.main}>
          <View style={styles.headArea}>
            <Text style={styles.title}>Mortgage Estimator</Text>
          </View>
          <KeyboardAvoidingView style={{flex: 1}}>
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
            <View style={styles.calc}>
              <Text style={styles.subttl}>Instalment Estimator</Text>
                {form.map(({ key, label, placeholder1 }) => (
                  <View key={key} style={styles.calcForm}>
                    <Text style={styles.ttl}>{label}</Text>
                    <TextInput
                      style={styles.input}
                      placeholderTextColor={'white'}
                      selectionColor={'white'}
                      placeholder={placeholder1}
                      keyboardType='decimal-pad'
                      value={
                        key === 'price' ? price :
                        key === 'rate' ? interestRate :
                        key === 'term' ? loanTerm :
                        downPay
                      }
                      onChangeText={(text) => {
                        if (key === 'price') setPrice(text);
                        else if (key === 'rate') setInterestRate(text);
                        else if (key === 'term') setLoanTerm(text);
                        else if (key === 'DP') setdownPay(text);
                      }}
                    />
                  </View>
                ))}
              </View>
              <View style={styles.buttonArea}>
                <TouchableOpacity style={styles.but} onPress={calculate}>
                  <Text style={styles.butType}>Calculate</Text>
                </TouchableOpacity>
              </View>
              {result !== '' && (
                  <Text style={{ color: 'white', fontSize:  14, textAlign: 'justify', marginTop: 20, paddingHorizontal: 20  }}>
                    {result}
                  </Text>
              )}
              <ScrollView horizontal={true} style={{ marginHorizontal: 10 }}>
                {chart.length > 0 && (
                  <LineChart
                    data={{
                      labels: chart.map((_, i) => `Y ${i + 1}`),
                      datasets: [{ data: chart.map(v => v / 1_000_000_000) }]
                    }}
                    width={screenWidth * 1}
                    height={260}
                    yAxisLabel="$"
                    yAxisSuffix="M"
                    chartConfig={{
                      backgroundColor: "#205781",
                      backgroundGradientFrom: "#205781",
                      backgroundGradientTo: "#3674b5",
                      decimalPlaces: 2,
                      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                      propsForDots: {
                        r: "6",
                        strokeWidth: "1",
                        stroke: "#ffffff"
                      },
                      style: {
                        borderRadius: 8,
                        paddingHorizontal: 10,
                        marginHorizontal: 10,
                      },
                    }}
                    bezier
                    renderDotContent={({ x, y, index, indexData }) => (
                      <Text
                        key={index}
                        style={{
                          position: 'absolute',
                          top: y - 24,
                          left: x - 12,
                          color: 'white',
                          fontSize: 10,
                          fontWeight: 'bold',
                          opacity: 0.8,
                        }}>
                        { (indexData * 1_000_000_000).toLocaleString('id-ID') }
                      </Text>
                    )}
                    style={{
                      marginVertical: 10,
                      borderRadius: 8,
                      marginHorizontal: 10,
                    }}
                  />
                )}
              </ScrollView>
              {result1 !== '' && (
                  <Text style={{ color: 'white', fontSize:  14, textAlign: 'justify', marginTop: 20, paddingHorizontal: 20  }}>
                    {result1}
                  </Text>
              )}
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
  },
  header:{
    flexDirection: 'row',
    justifyContent:'space-between',
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 15,
  },
  main: {
    flex: 3,
  },
  headArea:{
    justifyContent: 'center',
    backgroundColor: '#3674b5',
    width: 300,
    height: 70,
    padding: 18,
    marginTop: 10,
    marginBottom: 10,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  title: {
    fontSize: 32,
    color: 'white',
    fontFamily: 'Arial',
    fontWeight: '600',
  },
  calc:{
    marginTop: 15,
    width: 'auto',
    padding: 15,
    borderRadius: 8,
  },
  subttl:{
    color: 'white',
    fontWeight: '700',
    fontSize: 22,
    fontFamily: 'Arial',
  },
  calcForm:{
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 20,
  },
  ttl:{
    marginVertical: 10,
    fontSize: 18,
    color: 'white',
    marginBottom: 15,
    textAlignVertical: 'center',
    fontWeight: '600', 
    fontFamily: 'Arial', 
  },
  input: {
    padding: 10,
    color: 'white',
    height: 40,
    width: 180,
    borderRadius: 8,
    backgroundColor: '#3674b5',
    textAlign: 'right'
  },
  buttonArea: {
    alignItems: 'center',
    marginTop: 15,
    justifyContent: 'center'
  },
  but:{
    margin: 15,
    borderRadius: 8,
    backgroundColor: '#3674b5',
    height: 50,
    width: 240,
    padding: 14,
  },
  butType:{
    color: 'white',
    fontSize: 20,
    fontFamily: 'Arial',
    fontWeight: '600',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
})

export default MorgageEst
