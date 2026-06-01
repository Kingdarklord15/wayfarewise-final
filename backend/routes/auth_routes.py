from flask import Blueprint

from controllers.auth_controller import login, signup


auth_bp = Blueprint("auth", __name__)

auth_bp.post("/signup")(signup)
auth_bp.post("/login")(login)
