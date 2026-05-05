# Trading Platform 🚀

A professional, full-stack trading application built with **React** and **Spring Boot**. This platform provides real-time market data, portfolio management, secure withdrawals, and AI-driven insights.

## ✨ Features

- **Real-time Market Data**: Integrated with CoinGecko for live cryptocurrency prices and trends.
- **Portfolio Tracking**: Manage your assets, view profit/loss metrics, and track trading history.
- **Secure Transactions**: Robust wallet system with support for deposits and withdrawals.
- **Payment Integration**: Seamless payments via Stripe and Razorpay.
- **AI-Driven Insights**: Leverages Google Gemini for market analysis and predictions.
- **Secure Authentication**: Traditional login/signup and Google OAuth2 integration.
- **User Verification**: Two-factor authentication (2FA) and account verification flows.

## 🛠 Tech Stack

### Frontend
- **Framework**: React.js
- **Styling**: Tailwind CSS
- **State Management**: Redux
- **Build Tool**: Vite

### Backend
- **Framework**: Spring Boot
- **Database**: H2 (In-memory) / MySQL (Optional)
- **Security**: Spring Security & OAuth2
- **Mail**: Spring Boot Starter Mail

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Java (v17+)
- Maven

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/trading-platform.git
   cd trading-platform
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   # Copy .env.example to .env and configure your keys
   mvn spring-boot:run
   ```

3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 🔐 Environment Variables

Refer to [.env.example](.env.example) for a list of required environment variables. Key categories include:
- Database credentials
- SMTP settings for emails
- Stripe and Razorpay API keys
- CoinGecko and Gemini API keys

## 🛣 Roadmap

- [ ] Support for multiple fiat currencies.
- [ ] Advanced charting with TradingView integration.
- [ ] Mobile application (React Native).
- [ ] Push notifications for price alerts.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'feat: add some amazing feature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👥 Team Members

| Name | Student ID |
| :--- | :--- |
| **Akhilesh Kumar** | 2201330100028 |
| **Prince Singh** | 2201330100185 |
| **Akhilesh Kumar** | 2201330100027 |
| **Abhishek Kumar Shrivastav** | 2201330100011 |

---
Built with ❤️ for the College Project.
