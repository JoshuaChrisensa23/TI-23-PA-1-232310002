import React, { useEffect, useState } from 'react';
import { FontAwesome6 } from '@expo/vector-icons';
import { ScrollView, View, StyleSheet, SafeAreaView, Image, Text, TouchableOpacity, Alert, Dimensions, ImageBackground, } from 'react-native';
import { getHistory, clearHistory, deleteHistoryItem } from './logic/HistoryStorage';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get("window").width;

const HistoryPage = ({ navigation }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const load = async () => {
      const h = await getHistory();
      setHistory(h);
    };
    load();
  }, []);

  const handleDeleteItem = async (index) => {
    const updated = await deleteHistoryItem(index);
    setHistory(updated);
  };

  const handleClearAll = () => {
    Alert.alert('Confirm', 'Clear all history?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear All',
        style: 'destructive',
        onPress: async () => {
          await clearHistory();
          setHistory([]);
        },
      },
    ]);
  };

  const handleBack = () => {
    navigation.navigate('Home');
  };

  const handleRecalculate = (item) => {
    let screen = 'Loan';
    if (item.category === 'mortgage') {
      screen = 'Mortgage';
    } else if (item.category === 'student') {
      screen = 'StdLoan';
    }

    navigation.navigate(screen, {
      loanAmount: item.loanAmount || item.price || '',
      interestRate: item.interestRate || '',
      loanTerm: item.loanTerm || '',
      downPay: item.downPay || '',
      gradYear: item.gradYear || '',
    });
  };

  const formatCurrency = (num) => {
    if (typeof num !== 'number') num = Number(num);
    return isNaN(num) ? '0' : num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const formatToBillion = (num) => {
    return `${(num / 1_000_000_000).toFixed(2)}M`;
  };

  return (
    <ImageBackground source={require('../../assets/bg.png')} style={styles.container} resizeMode='cover'>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <FontAwesome6 name="house" size={36} color="white" onPress={handleBack} />
          <Image source={require('../../assets/logo.jpg')} style={{ width: 90, height: 40, borderRadius: 8 }} />
        </View>

        <View style={styles.main}>
          <View style={styles.headArea}>
            <Text style={styles.title}>History Calculator</Text>
          </View>

          <View style={styles.headerbutton}>
            <TouchableOpacity onPress={handleClearAll} style={{ marginTop: 10, borderRadius: 8, padding: 10, backgroundColor: 'red', alignItems: 'center', marginHorizontal: 20 }}>
              <Text style={{ color: 'white', fontWeight: 700, fontSize: 18, textAlign: 'center' }}>Clear All History</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scroll}>  
            {history.length === 0 ? (
              <Text style={styles.empty}>No history available.</Text>
            ) : (
              history.map((item, index) => (
                <View key={index} style={styles.itemContainer}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.categoryText}>Type: {item.category?.toUpperCase() || 'Unknown'}</Text>
                    {item.category === 'loan' && item.schedule && Array.isArray(item.schedule) && (
                      <View style={{ marginTop: 10 }}>
                        <Text style={{ fontWeight: 'bold', color: '#555' }}>Payment Schedule:</Text>
                        <View style={styles.tableHeader}>
                          <Text style={styles.tableCell}>Month</Text>
                          <Text style={styles.tableCell}>Rate (%)</Text>
                          <Text style={styles.tableCell}>Payment ($)</Text>
                        </View>
                        {item.schedule.map((row, i) => (
                          <View key={i} style={styles.tableRow}>
                            <Text style={styles.tableCell}>{row.month}</Text>
                            <Text style={styles.tableCell}>{row.interestRate}</Text>
                            <Text style={styles.tableCell}>{formatCurrency(row.payment)}</Text>
                          </View>
                        ))}
                      </View>
                    )}

                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {item.category === 'mortgage' && item.chart && (() => {
                        const cleanedChart = Array.isArray(item.chart)
                          ? item.chart.map(val => {
                              const num = Number(val);
                              return isFinite(num) && !isNaN(num) ? num : 0;
                            })
                          : [];
                        const validChart = cleanedChart.length > 0 ? cleanedChart : [0];

                        return (
                          <LineChart
                            data={{
                              labels: validChart.map((_, i) => `Y ${i + 1}`),
                              datasets: [{ data: validChart.map(v => v / 1_000_000_000) }]
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
                        );
                      })()}
                    </ScrollView>

                    {item.category === 'student' && item.schedules && Array.isArray(item.schedules) && item.schedules.length > 0 && (
                      <View style={{ marginTop: 10 }}>
                        <Text style={{ color: '#555', fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>Payment Schedule:</Text>
                        <View style={styles.tableHeader}>
                          <Text style={styles.tableCell}>Year</Text>
                          <Text style={styles.tableCell}>Interest (%)</Text>
                          <Text style={styles.tableCell}>Payment ($)</Text>
                          <Text style={styles.tableCell}>Balance ($)</Text>
                        </View>
                        {item.schedules.map((row, i) => (
                          <View key={i} style={styles.tableRow}>
                            <Text style={styles.tableCell}>{row.year}</Text>
                            <Text style={styles.tableCell}>{row.interest}</Text>
                            <Text style={styles.tableCell}>{formatCurrency(row.principal)}</Text>
                            <Text style={styles.tableCell}>{formatCurrency(row.balance)}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>

                  <Text style={styles.itemText}>
                    {item.category === 'mortgage'
                      ? `\nProperty Price: $${item.price >= 1_000_000_000 ? formatToBillion(item.price) : formatCurrency(item.price)},\t Interest Rate: ${item.interestRate}%,\t Term: ${item.loanTerm} Yrs,\t DP: ${item.downPay}%`
                      : item.category === 'loan'
                      ? `\nLoan Amount: $${item.loanAmount >= 1_000_000_000 ? formatToBillion(item.loanAmount) : formatCurrency(item.loanAmount)},\t Interest Rate: ${item.interestRate}%,\t Term: ${item.loanTerm} months`
                      : `\nTotal Borrowed: $${item.loanAmount >= 1_000_000_000 ? formatToBillion(item.loanAmount) : formatCurrency(item.loanAmount)},\t Interest Rate: ${item.interestRate}%,\t Term: ${item.loanTerm} Yrs,\t Grad in: ${item.gradYear || '-'} Yrs`
                    }
                  </Text>
                  
                  <View style={styles.actionRow}>
                    <TouchableOpacity style={{backgroundColor: '#205781', padding: 10, borderRadius: 5, width: 90}} onPress={() => handleRecalculate(item)}>
                      <Text style={styles.recalculate}>Recalculate</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{backgroundColor: 'red', padding: 10, borderRadius: 5, width: 90}} onPress={() => handleDeleteItem(index)}>
                      <Text style={styles.delete}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
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
    width: 270,
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
    fontFamily: 'Arial',
  },
  scroll: {
    paddingHorizontal: 20,
  },
  headerbutton: {
    marginBottom: 20,
    marginTop: 5,
  },
  empty: {
    textAlign: 'center',
    fontFamily: 'Arial',
    color: '#ccc',
    fontSize: 16,
    marginTop: 40,
  },
  itemContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
  },
  itemText: {
    color: '#333',
    fontFamily: 'Arial',
    fontSize: 15,
  },
  categoryText: {
    fontSize: 14,
    fontStyle: 'italic',
    fontFamily: 'Arial',
    color: '#777',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  resultText: {
    marginTop: 6,
    color: '#555',
    fontWeight: 'bold',
    fontFamily: 'Arial',
  },
  recalculate: {
    color: 'white',
    fontFamily: 'Arial',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  delete: {
    textAlign: 'center',
    fontFamily: 'Arial',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginTop: 10,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  tableCell: {
    flex: 1,
    color: '#333',
    fontSize: 13,
    textAlign: 'center',
    fontFamily: 'Arial',
  },
});

export default HistoryPage;
