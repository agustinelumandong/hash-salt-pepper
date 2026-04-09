import secrets
import hashlib
import os
from dotenv import load_dotenv

load_dotenv()

# Pepper is a secret constant loaded from the environment (not stored in the database).
# It adds an extra layer of security: even if the database is fully compromised,
# an attacker cannot crack the passwords without also knowing the pepper.
PEPPER = os.getenv("PEPPER")

def generate_salt() -> str:
    """
    Generate a cryptographically random salt (64 hex characters = 32 bytes).
    A unique salt is created for every user at registration time.
    This ensures that two users with the same password will have different hashes,
    and prevents precomputed rainbow table attacks.
    """
    return secrets.token_hex(32)

def hash_password(password: str, salt: str) -> str:
    """
    Hash a password using SHA-256 with salt and pepper.
    Combination order: password + salt + pepper
    The result is a fixed-length hex digest that is safe to store in the database.
    """
    combined = password + salt + (PEPPER or "")
    return hashlib.sha256(combined.encode()).hexdigest()

def verify_password(input_password: str, salt: str, stored_hash: str) -> bool:
    """
    Verify a login attempt by re-hashing the input with the stored salt and pepper,
    then comparing the result to the stored hash using a direct equality check.
    """
    return hash_password(input_password, salt) == stored_hash