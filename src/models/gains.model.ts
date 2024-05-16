import { createConnection, Schema } from 'mongoose';
import dotenv from 'dotenv';


process.env.NODE_ENV === 'production' ?
    dotenv.config({ path: `.env.${process.env.NODE_ENV}` }) :
    dotenv.config();


export const samplerConnection = createConnection(process.env.DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const profileSchema = new Schema({
    first_name: String,
    last_name: String,
    date_of_birth: String,
    isAdmin: Boolean,
    email: { type: String, required: true },

    authentication: {
        password: { type: String, required: true, select: false },
        salt: { type: String, select: false },
        sessionToken: { type: String, select: false }
    }
}, { collection: 'profiles' });

const profileStatsSchema = new Schema({
    date: Date,
    age: Number,
    weight: Number,
    body_fat: Number,
    height: Number,
    neck: Number,
    chest: Number,
    belly: Number,
    butt: Number,
    left_arm: Number,
    right_arm: Number,
    left_forearm: Number,
    right_forearm: Number,
    left_leg: Number,
    right_leg: Number,
    profile_id: String,
},
    { collection: 'profileStats' });

const exerciseSchema = new Schema({
    name: String,
    primary_muscle: String,
    balance: String,
    muscle_group: { type: String, enum: ["chest", "back", "legs", "arms", "core", "delts"] },
}, {
    collection: 'exercises'
});

const setLogSchema = new Schema({
    date_and_time: Date,
    exercise_id: String,
    profile_id: String,
    total_reps: Number,
    left_reps: Number,
    right_reps: Number,
    set_weight: Number,
    exercise_name: String,
}, { collection: 'setLogs' });


export const ProfileModel = samplerConnection.model('Profile', profileSchema);
export const ProfileStatsModel = samplerConnection.model('ProfileStats', profileStatsSchema);
export const ExerciseModel = samplerConnection.model('Exercise', exerciseSchema);
export const SetLogModel = samplerConnection.model('SetLog', setLogSchema);

// profiles
export const postProfile = (values: Record<string, any>) => ProfileModel.create(values);
export const getProfileByEmail = (email: string) => ProfileModel.findOne({ email });
export const getProfileBySessionToken = (sessionToken: string) => ProfileModel.findOne({
    'authentication.sessionToken': sessionToken
})
export const getAllProfiles = () => ProfileModel.find();
export const getAllProfileEmails = () => ProfileModel.find({}, { email: 1 });

export const getProfileById = (id: string) => ProfileModel.findById({ _id: id });
export const patchAProfileById = (id: string, values: Record<string, any>) => ProfileModel.findOneAndUpdate({ _id: id }, values);
export const deleteProfileById = (id: string) => ProfileModel.findOneAndRemove({ _id: id });
export const getAProfilesExerciseList = (id: string) => ProfileModel.find({ _id: id }, { exercises: 1 });// TODO Delete action
// exercises
export const postExercise = (values: Record<string, any>) => ExerciseModel.create(values);
export const getAllExercises = () => ExerciseModel.find();
export const getOneExerciseById = (id: string) => ExerciseModel.findById({ _id: id });
export const patchAnExerciseById = (id: string, values: Record<string, any>) => ExerciseModel.findOneAndUpdate({ _id: id }, values);
export const deleteExerciseById = (id: string) => ExerciseModel.findOneAndRemove({ _id: id });

// setLogs 
export const postProfileSet = (values: Record<string, any>) => SetLogModel.create(values);
export const getAllProfileSets = (profile_id: string) => SetLogModel.find({ profile_id });
// export const getProfileLogsById = (logId: string) => SetLogModel.findById({ _id: logId })
export const patchAProfileSet = (profile_id: string, set_id: string, values: Record<string, any>) => SetLogModel.findOneAndUpdate({ profile_id, _id: set_id }, values);
export const deleteAProfileSet = (id: string) => SetLogModel.findOneAndRemove({ _id: id });

// profileStats
export const postProfileStats = (values: Record<string, any>) => ProfileStatsModel.create(values);
export const getAllProfileStats = (profile_id: string) => ProfileStatsModel.find({ profile_id: profile_id });
export const patchAProfileStatById = (profile_id: string, stat_id: string, values: Record<string, any>) => ProfileStatsModel.findOneAndUpdate({ profile_id, _id: stat_id }, values);

export const getAProfileStatById = (profile_id: string, _id: string) => ProfileStatsModel.find({ profile_id, _id });
export const deleteAProfileStatById = (id: string) => ProfileStatsModel.findOneAndRemove({ _id: id });
