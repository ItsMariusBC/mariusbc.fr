import bcrypt from 'bcryptjs';

const password = process.argv[2];
if (!password) {
  console.error('Usage: node scripts/hash-password.mjs <password>');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 12);
const b64 = Buffer.from(hash, 'utf8').toString('base64');

console.log('\nADMIN_PASSWORD_HASH_B64 (paste as-is in your env):');
console.log(b64);
console.log();
