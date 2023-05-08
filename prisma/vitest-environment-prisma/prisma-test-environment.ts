import { Environment } from "vitest";

export default <Environment> {
    name: 'prisma',
    async setup() {
        console.log('SETUP')
        return {
            teardown() {console.log('TEARDOWN')},
        }
    }
}