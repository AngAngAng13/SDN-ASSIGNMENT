import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

import Team from './models/team.model.js';
import Player from './models/player.model.js';
import Member from './models/member.model.js';
import connectDB from './config/database.js';
import logger from './config/logger.js';

const SALT_ROUNDS = 10;
const TEAM_COUNT = 10;
const PLAYERS_PER_TEAM = 5;
const MEMBER_COUNT = 40;

const getPlayerImageUrl = () => {
    const seed = faker.string.uuid();
    return `https://picsum.photos/seed/${seed}/400/400`;
}

const seedDatabase = async () => {
    try {
        await connectDB();

        logger.info('Clearing database...');
        await Team.deleteMany({});
        await Player.deleteMany({});
        await Member.deleteMany({});
        logger.info('Database cleared.');

        logger.info('Seeding teams...');
        const teams = [];
        for (let i = 0; i < TEAM_COUNT; i++) {
            teams.push({
                teamName: `${faker.location.city()} FC`,
            });
        }
        const createdTeams = await Team.create(teams);
        logger.info(`${createdTeams.length} teams seeded.`);

        logger.info('Seeding players...');
        const players = [];
        for (const team of createdTeams) {
            for (let i = 0; i < PLAYERS_PER_TEAM; i++) {
                players.push({
                    playerName: faker.person.fullName(),
                    image: getPlayerImageUrl(),
                    cost: faker.number.int({ min: 10, max: 150 }),
                    isCaptain: faker.datatype.boolean(0.2), 
                    information: faker.lorem.paragraph(),
                    team: team._id,
                    comments: []
                });
            }
        }
        await Player.create(players);
        logger.info(`${players.length} players seeded.`);

        logger.info('Seeding members...');
        const members = [];
        const hashedPassword = await bcrypt.hash('password123', SALT_ROUNDS);
        for (let i = 0; i < MEMBER_COUNT; i++) {
            members.push({
                membername: faker.internet.username().toLowerCase(),
                password: hashedPassword,
                name: faker.person.fullName(),
                YOB: faker.date.birthdate({ min: 1980, max: 2005, mode: 'year' }).getFullYear(),
                isAdmin: false,
            });
        }

        const adminPassword = await bcrypt.hash('adminpassword', SALT_ROUNDS);
        members.push({
            membername: 'admin',
            password: adminPassword,
            name: 'Administrator',
            YOB: 1990,
            isAdmin: true,
        });

        await Member.create(members);
        logger.info(`${members.length} members seeded.`);

        logger.info('Database seeding complete!');
    } catch (error) {
        logger.error('Error seeding database:', error);
    } finally {
        await mongoose.disconnect();
        logger.info('Disconnected from MongoDB.');
    }
};

seedDatabase();