import { MigrationInterface, QueryRunner } from "typeorm";

export class V11739882149919 implements MigrationInterface {

    
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO "user" (username, password, "createdAt", "updatedAt")
            VALUES ('root', '$2b$10$xzwC4dUpyAC535b/LRD5JebxoZ80xNxUICobUp3uM6Ibpk0DJJEZS', NOW(), NOW())
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM "user" WHERE username = 'root'
        `);
    }

}
