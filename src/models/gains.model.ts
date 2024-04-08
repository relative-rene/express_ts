import { createConnection, Schema } from 'mongoose';
import dotenv from 'dotenv';


process.env.NODE_ENV === 'production'?
  dotenv.config({ path:`.env.${process.env.NODE_ENV}`}):
  dotenv.config();


const samplerConn = createConnection(process.env.DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const profileSchema = new Schema({
    first_name: String,
    last_name: String,
    date_of_birth: String,
    email: { type: String, required: true },

    authentication: {
        password: { type: String, required: true, select: false },
        salt: { type: String, select: false },
        sessionToken: { type: String, select: false }
    }
}, { collection: 'profiles' });

const profileStatsSchema = new Schema({
    profile_id: String,
    body_fat_percent: String,
    chest: String,
    abs: String,
    thigh: String,
    tricep: String,
    suprailiac: String,
    lean_body_mass: String,
    weight: String,
    height: String,
    age: String
},
    { collection: 'profileStats' });

const exerciseSchema = new Schema({
    name: String,
    primary_muscle: String,
    balance: String,
    muscle_group: { type: String, enum: ["chest", "back", "legs", "arms", "abs", "delts"] },
}, {
    collection: 'exercises'
});

const setLogSchema = new Schema({
    exercise_id: String,
    profile_id: String,
    total_reps: Number,
    left_reps: Number,
    right_reps: Number,
    set_weight: Number,
    date_and_time: Date,
    exercise_name: String,
}, { collection: 'setLogs' });


export const ProfileModel = samplerConn.model('Profile', profileSchema);
export const ProfileStatsModel = samplerConn.model('ProfileStats', profileStatsSchema);
export const ExerciseModel = samplerConn.model('Exercise', exerciseSchema);
export const SetLogModel = samplerConn.model('SetLog', setLogSchema);

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
export const postSetLog = (values: Record<string, any>) => SetLogModel.create(values);
export const getAllProfileSets = (profile_id: string) => SetLogModel.find({ profile_id });
// export const getProfileLogsById = (logId: string) => SetLogModel.findById({ _id: logId })
export const patchAProfileSet = (id: string, values: Record<string, any>) => SetLogModel.findOneAndUpdate({ _id: id, values });
export const deleteAProfileSet = (id: string) => SetLogModel.findOneAndRemove({ _id: id });

// profileStats
export const postProfileStats = (values: Record<string, any>) => ProfileStatsModel.create(values);
export const getAllProfileStats = (profile_id: string) => ProfileStatsModel.find({ "profile_id": 1234 });
export const getAProfileStatById = (profile_id: string, _id: string) => ProfileStatsModel.find({ profile_id, _id });
export const patchAProfileStatById = (profile_id: string, values: Record<string, any>) => ProfileStatsModel.findOneAndUpdate({ profile_id }, values);
export const deleteAProfileStatById = (id: string) => ProfileStatsModel.findOneAndRemove({ _id: id });
