import { Sequelize } from "sequelize";
import config from 'config'
const dbConfig = config.get('database')

const db = new Sequelize(dbConfig.name, dbConfig.username, dbConfig.password, {
    dialect: dbConfig.dialect,
    storage: dbConfig.storage,
    logging: dbConfig.logging
})

export default db