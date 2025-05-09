import { type ReactNode } from "react"
import styles from "./App.module.css"
import { Header } from "antd/es/layout/layout"
import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom"
import HomePage from "./Pages/HomePage/HomePage"
import ConverterPage from "./Pages/ConverterPage/ConverterPage"
import '@ant-design/v5-patch-for-react-19';

interface RouteConfig {
    path: string,
    label: string,
    children: ReactNode | null,
}

const routes: RouteConfig[] = [
    {
        path: '/',
        label: 'Главная',
        children: <HomePage/>,
    },
    {
        path: '/LR_1',
        label: 'Конвертер',
        children: <ConverterPage/>
    }
]

const Navigation = () => (
    <Header className={styles.header}>
        {routes.map(({path, label}) => (
            <Link key={path} to={path} className={styles.link}>{label}</Link>
        ))}
    </Header>
)

const App = () => (
    <Router>
        <Navigation/>
        <Routes>
            {
                routes.map(({path, children}) => (
                    <Route key={path} path={path} element={children}/>
                ))
            }
        </Routes>
    </Router>
)

export default App
