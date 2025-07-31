import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App.tsx"
import "./index.css"
import { AuthProvider } from "./context/auth-context"
import { ThemeProvider } from "./context/theme-context"
import { LanguageProvider } from "./context/language-context"
import { CurrencyProvider } from "./context/currency-context"
import { FavoritesProvider } from "./context/favorites-context"
import { CartProvider } from "./context/cart-context"
import { Toaster } from "sonner"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <CurrencyProvider>
            <AuthProvider>
              <FavoritesProvider>
                <CartProvider>
                  <App />
                  <Toaster position="top-right" />
                </CartProvider>
              </FavoritesProvider>
            </AuthProvider>
          </CurrencyProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
