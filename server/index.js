import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz', 12);

const app = express();
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Database setup using lowdb
const adapter = new JSONFile('./udyam.json');
const db = new Low(adapter, { submissions: [], step1: [], step2: [], step3: [] });
await db.read();
db.data ||= { submissions: [], step1: [], step2: [], step3: [] };

// Helpers
const upsert = async (table, submissionId, data) => {
  const now = new Date().toISOString();
  const list = db.data[table];
  const idx = list.findIndex(r => r.submission_id === submissionId);
  if (idx === -1) {
    list.push({ submission_id: submissionId, created_at: now, updated_at: now, ...data });
  } else {
    list[idx] = { ...list[idx], ...data, updated_at: now };
  }
  await db.write();
};

// Routes
app.post('/api/submissions', async (req, res) => {
  const id = nanoid();
  const now = new Date().toISOString();
  db.data.submissions.push({ id, created_at: now, updated_at: now, current_step: 1 });
  await db.write();
  res.status(201).json({ id });
});

app.get('/api/submissions/:id', async (req, res) => {
  const { id } = req.params;
  const submission = db.data.submissions.find(s => s.id === id);
  if (!submission) return res.status(404).json({ error: 'Not found' });
  const step1 = db.data.step1.find(r => r.submission_id === id) || null;
  const step2 = db.data.step2.find(r => r.submission_id === id) || null;
  res.json({ submission, step1, step2 });
});

app.post('/api/submissions/:id/step1', async (req, res) => {
  const { id } = req.params;
  const exists = db.data.submissions.find(s => s.id === id);
  if (!exists) return res.status(404).json({ error: 'Submission not found' });
  const {
    aadhaarNumber,
    entrepreneurName,
    consent,
    typeOfOrganisation,
    panNumber,
    panHolderName,
    dobOrDoi,
    panConsent,
  } = req.body || {};

  if (!aadhaarNumber || !entrepreneurName || consent !== true) {
    return res.status(400).json({ error: 'Invalid step1 payload' });
  }

  await upsert('step1', id, {
    aadhaar_number: String(aadhaarNumber),
    entrepreneur_name: String(entrepreneurName),
    aadhaar_consent: consent ? 1 : 0,
    type_of_organisation: typeOfOrganisation ?? null,
    pan_number: panNumber ?? null,
    pan_holder_name: panHolderName ?? null,
    dob_or_doi: dobOrDoi ?? null,
    pan_consent: panConsent ? 1 : 0,
  });
  exists.current_step = Math.max(exists.current_step, 2);
  exists.updated_at = new Date().toISOString();
  await db.write();
  res.json({ ok: true });
});

app.post('/api/submissions/:id/step2', async (req, res) => {
  const { id } = req.params;
  const exists = db.data.submissions.find(s => s.id === id);
  if (!exists) return res.status(404).json({ error: 'Submission not found' });
  const {
    mobileNumber,
    emailAddress,
    dateOfBirth,
    gender,
    socialCategory,
    physicallyHandicapped,
  } = req.body || {};

  if (!mobileNumber || !emailAddress || !dateOfBirth || !gender || !socialCategory || !physicallyHandicapped) {
    return res.status(400).json({ error: 'Invalid step2 payload' });
  }

  await upsert('step2', id, {
    mobile_number: String(mobileNumber),
    email_address: String(emailAddress),
    date_of_birth: String(dateOfBirth),
    gender: String(gender),
    social_category: String(socialCategory),
    physically_handicapped: String(physicallyHandicapped),
  });
  exists.current_step = Math.max(exists.current_step, 3);
  exists.updated_at = new Date().toISOString();
  await db.write();
  res.json({ ok: true });
});

app.post('/api/submissions/:id/step3', async (req, res) => {
  const { id } = req.params;
  const exists = db.data.submissions.find(s => s.id === id);
  if (!exists) return res.status(404).json({ error: 'Submission not found' });
  
  const {
    businessName,
    businessType,
    businessCategory,
    businessAddress,
    businessCity,
    businessState,
    businessPincode,
    businessPhone,
    businessEmail,
    businessWebsite,
    businessDescription,
    investmentInPlant,
    investmentInEquipment,
    totalInvestment,
    employmentGenerated,
    dateOfCommencement,
    gstin,
    udyogAadhaar,
    emIID,
    bankAccountNumber,
    bankName,
    bankBranch,
    bankIFSCCode,
    bankAccountType,
    nomineeName,
    nomineeRelationship,
    nomineeAddress,
    nomineePhone,
    nomineeEmail,
    nomineePAN,
    nomineeAadhaar,
    nomineeConsent,
  } = req.body || {};

  if (!businessName || !businessType || !businessCategory || !businessAddress || 
      !businessCity || !businessState || !businessPincode || !businessPhone || 
      !businessEmail || !businessDescription || !investmentInPlant || 
      !investmentInEquipment || !totalInvestment || !employmentGenerated || 
      !dateOfCommencement || !bankAccountNumber || !bankName || !bankBranch || 
      !bankIFSCCode || !bankAccountType || !nomineeName || !nomineeRelationship || 
      !nomineeAddress || !nomineePhone || !nomineeEmail || !nomineePAN || 
      !nomineeAadhaar || nomineeConsent !== true) {
    return res.status(400).json({ error: 'Invalid step3 payload' });
  }

  await upsert('step3', id, {
    business_name: String(businessName),
    business_type: String(businessType),
    business_category: String(businessCategory),
    business_address: String(businessAddress),
    business_city: String(businessCity),
    business_state: String(businessState),
    business_pincode: String(businessPincode),
    business_phone: String(businessPhone),
    business_email: String(businessEmail),
    business_website: businessWebsite || null,
    business_description: String(businessDescription),
    investment_in_plant: Number(investmentInPlant),
    investment_in_equipment: Number(investmentInEquipment),
    total_investment: Number(totalInvestment),
    employment_generated: Number(employmentGenerated),
    date_of_commencement: String(dateOfCommencement),
    gstin: gstin || null,
    udyog_aadhaar: udyogAadhaar || null,
    em_iid: emIID || null,
    bank_account_number: String(bankAccountNumber),
    bank_name: String(bankName),
    bank_branch: String(bankBranch),
    bank_ifsc_code: String(bankIFSCCode),
    bank_account_type: String(bankAccountType),
    nominee_name: String(nomineeName),
    nominee_relationship: String(nomineeRelationship),
    nominee_address: String(nomineeAddress),
    nominee_phone: String(nomineePhone),
    nominee_email: String(nomineeEmail),
    nominee_pan: String(nomineePAN),
    nominee_aadhaar: String(nomineeAadhaar),
    nominee_consent: nomineeConsent ? 1 : 0,
  });
  
  exists.current_step = Math.max(exists.current_step, 4);
  exists.updated_at = new Date().toISOString();
  await db.write();
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});


