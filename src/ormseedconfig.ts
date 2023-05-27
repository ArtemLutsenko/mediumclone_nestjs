import ormconfig from "@app/ormconfig";

const ormseedconfig = {
  ...ormconfig,
  migrations: ['src/seeds/*.ts'],
}

export default ormseedconfig
