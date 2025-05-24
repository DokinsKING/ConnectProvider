import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react' // <-- Добавлено
import App from './App.tsx'
import { store, persistor } from './redux/store.ts' // <-- Теперь экспортируется и persistor

document.body.style.backgroundColor = "#b18d5e";

document.documentElement.style.minWidth = "1350px";


createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}> {/* <-- Обёртка PersistGate */}
      <StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StrictMode>
    </PersistGate>
  </Provider>
)