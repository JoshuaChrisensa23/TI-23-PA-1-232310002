import React from 'react'
import { FontAwesome6 } from '@expo/vector-icons';
import { KeyboardAvoidingView, Text, SafeAreaView, TextInput, View, StyleSheet, TouchableOpacity, ScrollView, Platform, Image, Alert, ImageBackground } from 'react-native'
import { saveToHistory } from '../logic/HistoryStorage';
import { useRoute } from '@react-navigation/native';

const LoanCalculator = ({navigation}) => {
  const route = useRoute();
  const [loanAmount, setLoanAmount] = React.useState(route.params?.loanAmount || '');
  const [interestRate, setInterestRate] = React.useState(route.params?.interestRate || '');
  const [loanTerm, setLoanTerm] = React.useState(route.params?.loanTerm || '');
  const [result, setResult] = React.useState('');
  const [paymentSchedule, setPaymentSchedule] = React.useState([]);
  
  const form = [
    {key: "Amount", label: "Loan Amount ($)", placeholder1: "e.g. 10000"},
    {key: "rate", label: "Interest Rate (%)", placeholder1: "%"},
    {key: "term", label: "Loan Terms (Month)", placeholder1: "e.g. 12"},
  ];

  const calculate = () => {
    if (!loanAmount || !interestRate || !loanTerm) {
      Alert.alert('Input Error', 'Please fill in all fields.');
      setPaymentSchedule([]);
      return;
    }

    const loan = parseFloat(loanAmount) || 0;
    const rInput = parseFloat(interestRate);
    const term = parseFloat(loanTerm) || 0;

    let rate = rInput ? rInput / 100 / 12 : 0;
    let M = 0;

    M = calculateMonthlyPayment(loan, rate, term);
    setResult(`Loan Amount: $${loan.toFixed(2)},\t Loan Term: ${term} months,\t Interest Rate: ${(rInput || 0).toFixed(2)}%`);
      
    let table = [];
    for (let i = 1; i <= term; i++) {
      const newR = rate + (i * 0.0002);
      const monthlyPayment = calculateMonthlyPayment(loan, newR, term);
      table.push({
        month: i,
        interestRate: (newR * 12 * 100).toFixed(2),
        payment: monthlyPayment.toFixed(2),
      });
    }
    setPaymentSchedule(table);

    const entry = {
      category: 'loan',
      loanAmount,
      interestRate,
      loanTerm,
      result: `Loan Amount: $${formatCurrency(loan.toFixed(2))},\t Loan Term: ${term} months,\t Interest Rate: ${(rInput || 0).toFixed(2)}%`,
      schedule: table
    };

    saveToHistory(entry);
  };

  const calculateMonthlyPayment = (loan, r, term) => {
    if (r === 0) return loan / term;
    return loan * (r * Math.pow(1 + r, term)) / (Math.pow(1 + r, term) - 1);
  };

  const handleBack = () =>{
    navigation.navigate('Home');
  }

  const formatCurrency = (num) => {
    if (typeof num !== 'number') num = Number(num);
    return isNaN(num) ? '0' : num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <ImageBackground source={require('../../../assets/bg.png')} style={styles.container} resizeMode='cover'>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <FontAwesome6 name="house" size={36} color="white" onPress={handleBack}/>
          <Image source={require('../../../assets/logo.jpg')} style={{ width: 90, height: 40, borderRadius: 8 }} />
        </View>
        <View style={styles.main}>
          <View style={styles.headArea}>
            <Text style={styles.title} >Loan Calculator</Text>
          </View>
          <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <ScrollView contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}>
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
                        key === 'Amount' ? loanAmount.toString() :
                        key === 'rate' ? interestRate.toString() :
                        loanTerm.toString()
                      }
                      onChangeText={(text) => {
                        if (key === 'Amount') setLoanAmount(text);
                        else if (key === 'rate') setInterestRate(text);
                        else if (key === 'term') setLoanTerm(text);
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
                <Text style={{ color: 'white', fontSize: 14, textAlign: 'justify', marginTop: 20, paddingHorizontal: 20  }}>
                  {result} 
                </Text>
              )}
              {paymentSchedule.length > 0 && (
                <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
                  <Text style={{ color: 'white', fontSize: 18, marginBottom: 10, alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>Monthly Payment Schedule</Text>
                  <View style={styles.tableHeader}>
                    <Text style={styles.tableCell}>Month</Text>
                    <Text style={styles.tableCell}>Rate (%)</Text>
                    <Text style={styles.tableCell}>Payment ($)</Text>
                  </View>
                  {paymentSchedule.map((item, index) => (
                    <View key={index} style={styles.tableRow}>
                      <Text style={styles.tableCell}>{item.month}</Text>
                      <Text style={styles.tableCell}>{item.interestRate}</Text>
                      <Text style={styles.tableCell}>{formatCurrency(item.payment)}</Text>
                    </View>
                  ))}
                </View>
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
    width: 250,
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
    fontFamily: 'Arial',
    fontWeight: '700',
    fontSize: 22,
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
    fontFamily: 'Arial',
    marginBottom: 15,
    textAlignVertical: 'center',
    fontWeight: '600',  
  },
  input: {
    padding: 10,
    color: 'white',
    height: 40,
    width: 200,
    borderRadius: 8,
    backgroundColor: '#3674b5',
    textAlign: 'right'
  },
  buttonArea: {
    alignItems: 'center',
    marginTop: 25,
    justifyContent: 'center'
  },
  but:{
    margin: 20,
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
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'Arial',
    color: 'white',
  },
})

export default LoanCalculator
