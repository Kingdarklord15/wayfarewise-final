from flask import Blueprint

from controllers.user_controller import dashboard, favorite
from middleware.auth_middleware import token_required


user_bp = Blueprint("user", __name__)

user_bp.get("/dashboard")(token_required(dashboard))
user_bp.post("/favorite")(token_required(favorite))
