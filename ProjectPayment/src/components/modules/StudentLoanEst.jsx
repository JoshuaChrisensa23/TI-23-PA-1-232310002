import React from 'react'
import { FontAwesome6 } from '@expo/vector-icons';
import { KeyboardAvoidingView, Text, SafeAreaView, TextInput, View, StyleSheet, TouchableOpacity, ScrollView, Platform, Image, ImageBackground, Alert } from 'react-native'
import { saveToHistory } from '../logic/HistoryStorage';
import { useRoute } from '@react-navigation/native';

const StudentLoanEst = ({navigation}) => {
  const route = useRoute();
  const [loanAmount, setLoanAmount] = React.useState( route.params?.loanAmount || '')
  const [interestRate, setInterestRate] = React.useState( route.params?.interestRate || '' )
  const [loanTerm, setLoanTerm] = React.useState( route.params?.loanTerm || '' )
  const [ gradYear, setGradYear] = React.useState( route.params?.gradYear || '' )
  const [paymentSchedule, setPaymentSchedule] = React.useState([]);
  const [selected, setSelected] = React.useState(null);
  const [result, setResult] = React.useState('');
  
  const form = [
    {key: "Amount", label: "Annual Loan Amount ($)", placeholder1: "e.g. 10000"},
    {key: "rate", label: "Interest Rate (%)", placeholder1: "%"},
    {key: "term", label: "Loan Terms (Years)", placeholder1: "Years"},
    {key: "gradt", label: "Graduation In Year", placeholder1: "Years"},
  ];

  const opt = ['Yes', 'No'];

  const stdCalculate = () => {

    if (!loanAmount || !interestRate || !loanTerm) {
      Alert.alert('Input Error', 'Please fill in Loan, Interest Rate, and Loan Term fields.');
      setPaymentSchedule([]);
      return;
    }

    const annualLoan = parseFloat(loanAmount) || 0;
    const rate = parseFloat(interestRate) / 100 || 0;
    const termYears = parseFloat(loanTerm) || 0;
    const gradYears = parseFloat(gradYear) || 0;

    const totalBorrowed = annualLoan * gradYears;
    const balanceAfterGrad = totalBorrowed * Math.pow(1 + rate, gradYears);

    const monthlyRate = rate / 12;
    const totalMonths = termYears * 12;

    let monthlyPay = 0;
    if (monthlyRate === 0) {
      monthlyPay = balanceAfterGrad / totalMonths;
    } else {
      monthlyPay = balanceAfterGrad * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    }

    const totalRepay = monthlyPay * totalMonths;
    const totalInterest = totalRepay - balanceAfterGrad;
    let curBalance = balanceAfterGrad;

    let tables = [];
    for (let year = 1; year <= termYears; year++) {
      let yearPrincipal = 0;
      let yearInterest = 0;

      for (let m = 0; m < 12; m++) {
        const interest = curBalance * monthlyRate;
        let principal = monthlyPay - interest;

        if (principal < 0) principal = 0;
        curBalance -= principal;
        if (curBalance < 0) curBalance = 0;

        yearInterest += interest;
        yearPrincipal += principal;
      }

      let yearInterestRate = (yearInterest / balanceAfterGrad) * 100;

      tables.push({
        year,
        interest: yearInterestRate.toFixed(2),
        principal: yearPrincipal.toFixed(2),
        balance: curBalance.toFixed(2),
      });
    }

    setPaymentSchedule(tables);

    setResult(`Amount Borrowed: $${formatCurrency(totalBorrowed.toFixed(2))},\t Balance After Graduation: $${formatCurrency(balanceAfterGrad.toFixed(2))},\tTotal Interest: $${formatCurrency(totalInterest.toFixed(2))},\tLoan Term: ${termYears} Yrs`);

    const entry = {
      category: 'student',
      loanAmount,
      interestRate,
      loanTerm,
      gradYear,
      result: `Amount Borrowed: $${formatCurrency(totalBorrowed.toFixed(2))},\t Balance After Graduation: $${formatCurrency(balanceAfterGrad.toFixed(2))},\tTotal Interest: $${formatCurrency(totalInterest.toFixed(2))},\tLoan Term: ${termYears} Yrs`,
      schedules: tables
    };
    saveToHistory(entry);
  };

  const loanCalculate = () => {
    
    if (!loanAmount || !interestRate || !loanTerm || !gradYear) {
      Alert.alert('Input Error', 'Please fill in all fields.');
      setPaymentSchedule([]);
      return;
    }

    const annualLoan = parseFloat(loanAmount) || 0;
    const rate = parseFloat(interestRate) / 100 || 0;
    const termYears = parseFloat(loanTerm) || 0;

    const totalBorrowed = annualLoan;
    const monthlyRate = rate / 12;
    const totalMonths = termYears * 12;
    let monthlyPay = 0;

    if (monthlyRate !== 0) {
      monthlyPay = totalBorrowed * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    } else {
      monthlyPay = totalBorrowed / totalMonths;
    }

    const totalRepay = monthlyPay * totalMonths;
    const totalInterest = totalRepay - totalBorrowed;

    let tables = [];
    let curBalance = annualLoan;
    for (let year = 1; year <= termYears; year++) {
      let yearPrincipal = 0;
      let yearInterest = 0;

      for (let m = 0; m < 12; m++) {
        const interest = curBalance * monthlyRate;
        let principal = monthlyPay - interest;

        if (principal < 0) principal = 0;
        curBalance -= principal;
        if (curBalance < 0) curBalance = 0;

        yearInterest += interest;
        yearPrincipal += principal;
      }
      let yearInterestRate = (yearInterest / totalBorrowed) * 100;

      tables.push({
        year,
        interest: yearInterestRate.toFixed(2),
        principal: yearPrincipal.toFixed(2),
        balance: curBalance.toFixed(2),
      });
    }

    setResult(`Amount Borrowed: $${formatCurrency(totalBorrowed.toFixed(2))},\t Total Interest: $${formatCurrency(totalInterest.toFixed(2))},\tLoan Term: ${termYears} Yrs`);

    setPaymentSchedule(tables);

    const entry = {
      category: 'student',
      loanAmount,
      interestRate,
      loanTerm,
      result: `Amount Borrowed: $${formatCurrency(totalBorrowed.toFixed(2))}\t Total Interest: $${formatCurrency(totalInterest.toFixed(2))},\tLoan Term: ${termYears} Yrs`,
      schedules: tables
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
            <Text style={styles.title} >Student Credit Calc</Text>
          </View>
          <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <ScrollView contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}>
              <View style={styles.calc}>
                <Text style={styles.subttl}>Instalment Estimator</Text>
                <View style={{ }}>
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
                          key === 'term' ? loanTerm.toString() : gradYear.toString() 
                        } 
                        onChangeText={
                          (text) => { if (key === 'Amount') setLoanAmount(text); 
                            else if (key === 'rate') setInterestRate(text); 
                            else if (key === 'term') setLoanTerm(text); 
                            else if (key === 'gradt') setGradYear(text); }
                        }
                      />
                    </View>
                  ))}
                  <View style={styles.calcForm}>
                    <Text style={styles.ttl}>Pay After Graduation?</Text>
                    {opt.map((option, index) => (
                      <TouchableOpacity key={index} onPress={() => setSelected(option)} style={styles.radioCon}>
                        <View style={styles.radio}>
                          {selected === option && <FontAwesome6 name="check-circle" size={18} color="white" />}
                        </View>
                        <Text style={styles.ttl}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
              <View style={styles.buttonArea}>
                <TouchableOpacity 
                  style={styles.but} 
                  onPress={() => {
                    if (selected === 'Yes') stdCalculate();
                    else if (selected === 'No') loanCalculate();
                    else Alert.alert('Select Option', 'Please select an option to calculate.');
                  }}
                >
                  <FontAwesome6 name="calculator" size={24} color="white" />
                  <Text style={styles.butType}>Calculate</Text>
                </TouchableOpacity>
              </View>
              {result !== '' && (
                <Text style={{ color: 'white', fontSize: 14, textAlign: 'justify', marginTop: 20, paddingHorizontal: 20,fontFamily: 'Arial'  }}>
                  {result}
                </Text>
              )}
              {paymentSchedule.length > 0 && (
                <View style={{ marginTop: 20, paddingHorizontal: 20  }}>
                  <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 18, fontFamily: 'Arial' }}>Payment Schedule:</Text>
                  <View style={styles.tableHeader}>
                    <Text style={styles.tableCell}>Year</Text>
                    <Text style={styles.tableCell}>Interest (%)</Text>
                    <Text style={styles.tableCell}>Payment ($)</Text>
                    <Text style={styles.tableCell}>Balance ($)</Text>
                  </View>
                  {paymentSchedule.map((row, i) => (
                    <View key={i} style={styles.tableRow}>
                      <Text style={styles.tableCell}>{row.year}</Text>
                      <Text style={styles.tableCell}>{row.interest}</Text>
                      <Text style={styles.tableCell}>{formatCurrency(row.principal)}</Text>
                      <Text style={styles.tableCell}>{formatCurrency(row.balance)}</Text>
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
    width: 220,
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
    fontFamily: 'Arial',
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
    fontFamily: 'Arial',
    color: 'white',
    marginBottom: 15,
    textAlignVertical: 'center',
    fontWeight: '600',  
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
  radioCon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radio: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#3674b5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  butType:{
    color: 'white',
    fontSize: 20,
    fontFamily: 'Arial',
    fontWeight: '600',
    textAlignVertical: 'center',
    textAlign: 'center',
    marginLeft: 10,
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

export default StudentLoanEst
