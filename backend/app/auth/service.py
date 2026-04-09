# auth/service.py
from sqlalchemy.orm import Session
from app.auth.repository import UserRepository
from app.infrastructure.security.hashing import generate_salt, hash_password, verify_password
from app.auth.schema import SignUpRequest, SignUpResponse, SignInRequest, SignInResponse
from app.auth.model import User

class AuthService:
    def __init__(self, db: Session):
        self.repo = UserRepository(db)

    def register(self, data: SignUpRequest) -> SignUpResponse:
        # Reject duplicate usernames before attempting to create the account
        if self.repo.get_by_username(data.username):
            raise ValueError("Username already exists")

        # Generate a unique random salt for this user
        salt = generate_salt()
        # Hash the password combined with the salt and the global pepper
        hashed = hash_password(data.password, salt)

        # Only the username, salt, and hashed password are stored — never the plain password
        user = User(
            username=data.username,
            salt=salt,
            hashed_password=hashed
        )
        self.repo.create_user(user)
        return SignUpResponse(message="Registration successful", username=data.username)

    def login(self, data: SignInRequest) -> SignInResponse:
        # Look up the user and retrieve their stored salt
        user = self.repo.get_by_username(data.username)

        # Re-hash the input password with the stored salt + pepper and compare
        # A vague error message is intentional: prevents username enumeration
        if not user or not verify_password(data.password, user.salt, user.hashed_password):
            raise ValueError("Invalid username or password")

        return SignInResponse(message="Login successful", username=data.username)