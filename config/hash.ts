import { defineConfig, drivers } from '@adonisjs/core/hash'
import { HashDriverName } from '#config/beans/hash_driver_name'

const hashConfig = defineConfig({
  default: HashDriverName.SCRYPT,

  list: {
    [HashDriverName.SCRYPT]: drivers.scrypt({
      cost: 16384,
      blockSize: 8,
      parallelization: 1,
      maxMemory: 33554432,
    }),
  },
})

export default hashConfig

/**
 * Inferring types for the list of hashers you have configured
 * in your application.
 */
declare module '@adonisjs/core/types' {
  export interface HashersList extends InferHashers<typeof hashConfig> {}
}
