{{-- <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Loan Application - Calculate</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <style>
    body, html {
      height: 100%;
      margin: 0;
      background: url('{{ asset('assets/img/calculate.png') }}');
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
      font-family: 'Poppins', sans-serif;
    }
    .loan-card-wrapper {
      display: flex;
      align-items: flex-start;
      justify-content: center;
      gap: 5px;
      margin-bottom: 32px;
      margin-right: 145px;
    }
    .loan-logo {
      width: 140px;
      height: 140px;
      border-radius: 16px;
      object-fit: cover;
      background: #fff;
      border: 4px solid #fff;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      margin-top: 0px;
      margin-right: 5px;
    }
    .loan-card {
      background: #fff;
      border-radius: 16px;
      padding: 24px 32px 18px 32px;
      min-width: 320px;
      max-width: 800px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .loan-card .fw-bold {
      font-size: 1.25rem;
    }
    .loan-card-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 1.1rem;
      margin-bottom: 0;
    }
    .loan-card .type-label {
      font-size: 1rem;
      color: #444;
      margin-bottom: 0;
    }
    .loan-card .divider {
      border-bottom: 2px solid #205781;
      margin: 6px 0 8px 0;
    }
    .loan-card .term-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 1.1rem;
    }
    .estimator-card {
      background: #fff;
      border-radius: 16px;
      padding: 24px 32px 18px 32px;
      max-width: 820px;
      margin: 0 auto 32px auto;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }
    .estimator-card .fw-bold {
      font-size: 1.15rem;
      margin-bottom: 8px;
    }
    .estimator-form label {
      font-size: 1rem;
      color: #222;
      margin-bottom: 2px;
    }
    .estimator-form input[type="text"],
    .estimator-form input[type="number"] {
      border-radius: 8px;
      border: 1px solid #bbb;
      padding: 4px 12px;
      margin-bottom: 8px;
      width: 170px;
      display: inline-block;
      text-align: right;
      background: #f8f8f8;
    }
    #result {
      background-color: #f3f3f3;
      width: 170px;
    }
    .btn-calculate {
      background: #205781;
      color: #fff;
      font-weight: 600;
      border-radius: 8px;
      border: none;
      padding: 6px 32px;
      margin-right: 8px;
      margin-top: 0px;
      margin-bottom: 10px;
    }
    .btn-confirm {
      background: #fff;
      color:  #205781;
      font-weight: 700;
      border: 2px solid #fff;
      border-radius: 8px;
      padding: 6px 40px;
      margin-top: 8px;
      margin-bottom: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      text-decoration: none;
      transition: background 0.2s;
    }
    .btn-confirm:hover {
      background:  #205781;
      color: #fff;
    }
    .btn-back {
      background: #fff;
      color: #222;
      border-radius: 10px;
      border: none;
      width: 150px;
      padding: 12px 40px;
      font-weight: 500;
      font-size: 1.1rem;
      position: absolute;
      bottom: 32px;
      text-decoration: none;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      right: 48px;
    }
    .btn-info {
      background: #fff;
      color: #222;
      border-radius: 10px;
      border: none;
      padding: 12px 40px;
      font-weight: 500;
      font-size: 1.1rem;
      position: absolute;
      bottom: 32px;
      text-decoration: none;
      left: 48px;
    }
    @media (max-width: 900px) {
      .loan-card-wrapper { flex-direction: column; align-items: center; gap: 12px; margin-right: 0; }
      .loan-card, .estimator-card { min-width: 98vw; max-width: 98vw; padding: 12px; }
      .btn-info, .btn-back { position: static; margin: 8px 0; width: 100%; }
    }
  </style>
</head>
<body>
  <div class="container-fluid py-4 position-relative" style="min-height:100vh;">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <img src="{{ asset('assets/img/logo.png') }}" alt="Loan.ly" style="height:50px; border-radius:10px;">
      <div class="d-flex align-items-center gap-2">
        <span style="color:#fff; font-size:20px;">Asep Kopling</span>
        <img src="{{ asset('assets/img/profile.png') }}" alt="Profile" style="width:40px; height:40px; border-radius:50%;">
      </div>
    </div>
    <h2 class="text-center mb-4" style="color:#fff; font-weight:700;">Loan Application</h2>

    <!-- Loan Info Card -->
    <div class="loan-card-wrapper mb-4">
      <img src="{{ asset('assets/img/bank.png') }}" alt="Loan Inc Association" class="loan-logo">
      <div class="loan-card">
        <div class="fw-bold">Loan Inc Association</div>
        <div class="loan-card-row type-label">
          <span>Type Loan</span>
          <span>PayDay Loan</span>
        </div>
        <div class="divider"></div>
        <div class="loan-card-row term-row">
          <span>Term</span>
          <span>12 months</span>
        </div>
      </div>
    </div>

    <!-- Estimator Card -->
    <div class="estimator-card">
      <div class="fw-bold mb-2">Installment Estimator</div>
      <form id="calcForm" class="estimator-form">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <div>
            <label for="amount">Loan Amount</label>
          </div>
          <input type="text" id="amount" name="amount" value="$ 35,000" autocomplete="off">
        </div>
        <div class="d-flex justify-content-between align-items-center mb-2">
          <div>
            <label for="rate">Interest Rate (%)</label>
          </div>
          <input type="number" id="rate" name="rate" value="10" autocomplete="off">
        </div>
        <div class="d-flex justify-content-between align-items-center mb-2">
          <div>
            <label for="term">Loan Term (Months)</label>
          </div>
          <input type="number" id="term" name="term" value="12" autocomplete="off">
        </div>
        <div class="d-flex justify-content-center align-items-center mt-3">
          <button type="button" class="btn-calculate" onclick="calculateInstallment()">Calculate</button>
          <input type="text" id="result" readonly>
        </div>
      </form>
    </div>

    <div class="text-center">
      <button class="btn-confirm" type="button">CONFIRM</button>
    </div>
    <a href="/moredetails" target="_blank" class="btn-info" style="border-radius:8px;">More Info</a>
    <a href="/home" class="btn-back" style="border-radius:8px;">Back</a>
  </div>

  <script>
    // Flag untuk cek apakah sudah klik Calculate
    let hasCalculated = false;

    function calculateInstallment() {
      let amountStr = document.getElementById('amount').value.replace(/[^0-9.]/g, '');
      let rate = parseFloat(document.getElementById('rate').value);
      let term = parseInt(document.getElementById('term').value);
      let amount = parseFloat(amountStr);

      if (!amount || !rate || !term) {
        document.getElementById('result').value = '';
        hasCalculated = false;
        return;
      }

      let monthlyInterest = (amount * (rate / 100)) / term;
      let monthlyPrincipal = amount / term;
      let monthlyPayment = monthlyPrincipal + monthlyInterest;

      document.getElementById('result').value = '$ ' + monthlyPayment.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      document.getElementById('result').focus();

      hasCalculated = true;
    }

    document.getElementById('amount').addEventListener('blur', function () {
      let val = this.value.replace(/[^0-9.]/g, '');
      if (val) {
        val = parseFloat(val).toFixed(2);
        this.value = '$ ' + parseFloat(val).toLocaleString();
      }
    });

    // Event untuk tombol CONFIRM
    document.querySelector('.btn-confirm').addEventListener('click', function(e) {
      if (hasCalculated && document.getElementById('result').value.trim() !== '') {
        alert('Loan application confirmed! Monthly payment: ' + document.getElementById('result').value);
      }
      // Jika belum dihitung, tidak melakukan apa-apa
    });
  </script>
</body>
</html> --}}