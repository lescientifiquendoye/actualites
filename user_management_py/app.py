import streamlit as st
import requests
import json

# --- Configuration ---
API_BASE_URL = "http://localhost:8080/api" # Set this to YOUR ACTUAL BACKEND BASE URL
LOGIN_ENDPOINT = f"{API_BASE_URL}/auth/login"
USERS_ENDPOINT = f"{API_BASE_URL}/utilisateurs"
#ROLES_ENDPOINT = f"{API_BASE_URL}/roles"

# --- Session State Initialization ---
if 'logged_in' not in st.session_state:
    st.session_state.logged_in = False
if 'jwt_token' not in st.session_state:
    st.session_state.jwt_token = None
if 'user_email' not in st.session_state:
    st.session_state.user_email = None
if 'user_role' not in st.session_state: # Optional: to display user's role
    st.session_state.user_role = None

if 'show_form' not in st.session_state:
    st.session_state.show_form = False
if 'edit_mode' not in st.session_state:
    st.session_state.edit_mode = False
if 'current_user' not in st.session_state:
    st.session_state.current_user = {"id": None, "email": "", "password": "", "role": ""}
if 'message_type' not in st.session_state:
    st.session_state.message_type = None
if 'message_content' not in st.session_state:
    st.session_state.message_content = ""

# --- Helper Functions for Messages and API Calls ---

def set_message(type, content):
    """Sets a message to be displayed and triggers rerun."""
    st.session_state.message_type = type
    st.session_state.message_content = content
    # st.rerun() # Rerun to display the message immediately (optional, may cause flicker)

def clear_message():
    """Clears any displayed message and triggers rerun."""
    st.session_state.message_type = None
    st.session_state.message_content = ""
    # st.rerun() # Rerun to clear the message immediately (optional)

def get_auth_headers():
    """Returns headers with JWT token if available."""
    headers = {"Content-Type": "application/json"}
    if st.session_state.jwt_token:
        headers["Authorization"] = f"Bearer {st.session_state.jwt_token}"
    return headers

def handle_api_error(e, default_msg):
    """Extracts and displays error messages from API responses."""
    error_detail = {}
    if e.response is not None:
        try:
            error_detail = e.response.json()
            if e.response.status_code == 401:
                set_message("error", "Session expirée ou non autorisée. Veuillez vous reconnecter.")
                logout_user() # Force logout on 401
                return # Exit early to prevent further processing
        except json.JSONDecodeError:
            error_detail = {"message": e.response.text}
    set_message("error", f"{default_msg}: {error_detail.get('message', str(e))}")

# --- Authentication Logic ---

def login_user(email, password):
    """Attempts to log in the user via backend API."""
    clear_message()
    try:
        response = requests.post(LOGIN_ENDPOINT, json={"email": email, "password": password})
        response.raise_for_status() # Raise HTTPError for bad responses (4xx or 5xx)
        data = response.json()
        st.session_state.jwt_token = data.get("token")
        st.session_state.user_email = email
        st.session_state.user_role = data.get("user").get("role") # Assuming backend sends role
        st.session_state.logged_in = True
        set_message("success", f"Bienvenue, {email}!")
        st.rerun() # Rerun to show main content
    except requests.exceptions.RequestException as e:
        handle_api_error(e, "Erreur de connexion")

def logout_user():
    """Logs out the user by clearing session state."""
    st.session_state.logged_in = False
    st.session_state.jwt_token = None
    st.session_state.user_email = None
    st.session_state.user_role = None
    st.session_state.show_form = False
    st.session_state.edit_mode = False
    st.session_state.current_user = {"id": None, "email": "", "password": "", "role": ""}
    set_message("success", "Déconnexion réussie.")
    st.rerun() # Rerun to show login page

# --- User Management API Calls (modified to use auth headers) ---

def fetch_users():
    """Fetches all users from the backend."""
    try:
        response = requests.get(USERS_ENDPOINT, headers=get_auth_headers())
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        handle_api_error(e, "Erreur lors du chargement des utilisateurs")
        return []

def fetch_roles():
    """Fetches all available roles from the backend."""
    try:
        #response = requests.get("AD", headers=get_auth_headers())
       # response.raise_for_status()
        return {"role": "ADMIN"}
    except requests.exceptions.RequestException as e:
        handle_api_error(e, "Erreur lors du chargement des rôles")
        return []

def create_user(user_data):
    """Sends a POST request to create a new user."""
    try:
        response = requests.post(USERS_ENDPOINT, json=user_data, headers=get_auth_headers())
        response.raise_for_status()
        set_message("success", f"Utilisateur '{user_data['email']}' ajouté avec succès!")
        return True
    except requests.exceptions.RequestException as e:
        handle_api_error(e, "Erreur lors de l'ajout de l'utilisateur")
        return False

def update_user(user_id, user_data):
    """Sends a PUT request to update an existing user."""
    try:
        response = requests.put(f"{USERS_ENDPOINT}/{user_id}", json=user_data, headers=get_auth_headers())
        response.raise_for_status()
        set_message("success", f"Utilisateur '{user_data['email']}' mis à jour avec succès!")
        return True
    except requests.exceptions.RequestException as e:
        handle_api_error(e, "Erreur lors de la mise à jour de l'utilisateur")
        return False

def delete_user(user_id):
    """Sends a DELETE request to delete a user."""
    try:
        response = requests.delete(f"{USERS_ENDPOINT}/{user_id}", headers=get_auth_headers())
        response.raise_for_status()
        set_message("success", "Utilisateur supprimé avec succès!")
        return True
    except requests.exceptions.RequestException as e:
        handle_api_error(e, "Erreur lors de la suppression de l'utilisateur")
        return False

# --- UI Callbacks ---

def on_add_new_user_click():
    """Callback for 'Add New User' button."""
    st.session_state.show_form = True
    st.session_state.edit_mode = False
    st.session_state.current_user = {"id": None, "email": "", "password": "", "role": ""}
    clear_message()

def on_edit_user_click(user):
    """Callback for 'Edit' button in table."""
    st.session_state.show_form = True
    st.session_state.edit_mode = True
    # Ensure password field is cleared for security
    st.session_state.current_user = {**user, "password": ""}
    clear_message()

def on_delete_user_click(user_id):
    """Callback for 'Delete' button in table."""
    # Streamlit's native way to confirm actions within the app flow
    if st.warning("Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.", icon="🗑️"):
        # This part will execute only if the warning is displayed and user confirms
        if delete_user(user_id):
            st.rerun() # Reload users table if successful

def on_cancel_form_click():
    """Callback for 'Cancel' button in form."""
    st.session_state.show_form = False
    clear_message()

def on_form_submit():
    """Callback for form submission (Save/Create User)."""
    email = st.session_state.form_email.strip()
    password = st.session_state.form_password.strip()
    selected_role = st.session_state.form_role

    if not email:
        set_message("error", "L'email est requis.")
        return

    if not selected_role:
        set_message("error", "Veuillez sélectionner un rôle.")
        return

    if not st.session_state.edit_mode and not password:
        set_message("error", "Le mot de passe est requis pour la création d'un nouvel utilisateur.")
        return

    user_data = {"email": email, "role": selected_role}
    if password: # Only send password if it's not empty (for new user or explicit update)
        user_data["password"] = password

    if st.session_state.edit_mode:
        success = update_user(st.session_state.current_user["id"], user_data)
    else:
        success = create_user(user_data)

    if success:
        st.session_state.show_form = False
        st.rerun() # Reload users table if successful

# --- Main Streamlit App Layout ---

st.set_page_config(layout="wide", page_title="Gestion des Utilisateurs")

# --- Custom CSS for Styling ---
st.markdown(
    """
    <style>
    .reportview-container .main .block-container{
        padding-top: 2rem;
        padding-bottom: 2rem;
        padding-left: 5rem;
        padding-right: 5rem;
    }
    .stButton>button {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        font-weight: 700;
        transition: all 0.3s ease;
    }
    .stButton>button:hover {
        opacity: 0.9;
    }
    .st-emotion-cache-1r6dm7m { /* Targets the header of the expander/form */
        padding-bottom: 0px !important;
        padding-top: 0px !important;
    }
    .st-emotion-cache-zt5igj { /* Targets the radio button container */
        flex-direction: row; /* Make radios horizontal */
        gap: 1.5rem; /* Space between radios */
    }
    .st-emotion-cache-zt5igj div:has(input[type="radio"]) {
        flex-direction: row;
        align-items: center;
        gap: 0.5rem;
    }
    /* Styles for the manually rendered table */
    .table-container {
        border-collapse: collapse;
        width: 100%;
    }
    .table-header {
        background-color: #f3f4f6; /* Tailwind gray-100 */
        padding: 0.75rem 1.5rem;
        text-align: left;
        font-size: 0.75rem;
        font-weight: 600;
        color: #4b5563; /* Tailwind gray-600 */
        text-transform: uppercase;
        letter-spacing: 0.05em;
        border-bottom: 1px solid #e5e7eb;
    }
    .table-row {
        padding: 1rem 1.5rem;
        white-space: nowrap;
        font-size: 0.875rem;
        color: #1f2937; /* Tailwind gray-900 */
        border-bottom: 1px solid #e5e7eb; /* Tailwind gray-200 */
    }
    .table-row:hover {
        background-color: #f9fafb; /* Tailwind gray-50 */
    }
    .role-badge {
        display: inline-flex;
        align-items: center;
        padding: 0.25rem 0.75rem;
        border-radius: 9999px; /* Full rounded */
        font-size: 0.75rem;
        font-weight: 500;
        background-color: #eff6ff; /* Tailwind blue-50 */
        color: #1d4ed8; /* Tailwind blue-700 */
    }
    .action-buttons button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 9999px; /* Full rounded */
        transition: background-color 0.15s ease-in-out;
    }
    .action-buttons .edit-btn {
        color: #2563eb; /* Tailwind blue-600 */
    }
    .action-buttons .edit-btn:hover {
        background-color: #eff6ff; /* Tailwind blue-50 */
    }
    .action-buttons .delete-btn {
        color: #dc2626; /* Tailwind red-600 */
        margin-left: 0.5rem;
    }
    .action-buttons .delete-btn:hover {
        background-color: #fee2e2; /* Tailwind red-50 */
    }
    </style>
    """, unsafe_allow_html=True
)

# --- Global Message Display ---
if st.session_state.message_type == "success":
    st.success(st.session_state.message_content, icon="✅")
    clear_message() # Clear after display
elif st.session_state.message_type == "error":
    st.error(st.session_state.message_content, icon="🚨")
    clear_message() # Clear after display

# --- Conditional Rendering based on Authentication State ---
if not st.session_state.logged_in:
    st.subheader("Connexion")
    with st.form(key="login_form"):
        login_email = st.text_input("Email", key="login_email")
        login_password = st.text_input("Mot de passe", type="password", key="login_password")
        if st.form_submit_button("Se connecter"):
            login_user(login_email, login_password)
else:
    st.title(":busts_in_silhouette: Gestion des Utilisateurs")
    st.info(f"Connecté en tant que: {st.session_state.user_email} (Rôle: {st.session_state.user_role})")
    st.button("Se déconnecter", on_click=logout_user)

    st.markdown("---")

    # --- Add New User Button ---
    st.button(
        "➕ Ajouter un nouvel utilisateur",
        on_click=on_add_new_user_click,
        key="add_user_btn",
        use_container_width=True
    )

    st.markdown("---") # Separator

    # --- User Management Form (Expander) ---
    with st.expander(
        "Formulaire de gestion des utilisateurs",
        expanded=st.session_state.show_form
    ):
        if st.session_state.show_form:
            st.subheader(
                "Modifier l'utilisateur" if st.session_state.edit_mode else "Créer un nouvel utilisateur"
            )
            with st.form(key="user_form", clear_on_submit=False):
                st.text_input(
                    "Email de l'utilisateur",
                    key="form_email",
                    value=st.session_state.current_user["email"],
                    placeholder="ex: user@example.com",
                )
                st.text_input(
                    "Mot de passe",
                    type="password",
                    key="form_password",
                    value=st.session_state.current_user["password"],
                    placeholder="Laisser vide pour ne pas le changer (en mode édition)",
                )
                if not st.session_state.edit_mode:
                    st.markdown("<small style='color: red;'>* Requis pour la création</small>", unsafe_allow_html=True)

                # Fetch roles for radio buttons (only if logged in)
                roles = fetch_roles()
                role_names = [role['name'] for role in roles] if roles else []
                role_display_names = [r.replace('ROLE_', '') for r in role_names]

                if not role_names:
                    st.warning("Aucun rôle disponible. Impossible de créer/modifier un utilisateur.")
                else:
                    # Find index of current user's role to pre-select
                    try:
                        default_role_index = role_names.index(st.session_state.current_user["role"])
                    except ValueError:
                        default_role_index = 0 # Default to first role if current role not found or empty
                    
                    st.radio(
                        "Sélectionnez le rôle de l'utilisateur",
                        options=role_names, # Actual values to be passed to backend
                        format_func=lambda x: x.replace('ROLE_', ''), # What user sees
                        key="form_role",
                        index=default_role_index if st.session_state.current_user["role"] else None, # Pre-select
                        horizontal=True
                    )

                col1, col2 = st.columns(2)
                with col1:
                    st.form_submit_button(
                        "💾 Enregistrer les modifications" if st.session_state.edit_mode else "➕ Créer l'utilisateur",
                        on_click=on_form_submit,
                        use_container_width=True
                    )
                with col2:
                    st.form_submit_button(
                        "❌ Annuler",
                        on_click=on_cancel_form_click,
                        use_container_width=True
                    )
        else:
            st.info("Cliquez sur 'Ajouter un nouvel utilisateur' pour commencer.")

    st.markdown("---")

    # --- User List Table ---
    st.subheader("Utilisateurs enregistrés")

    users = fetch_users()

    if not users:
        st.info("Aucun utilisateur trouvé.")
    else:
        headers = ["ID", "Email", "Rôle", "Actions"]
        cols_widths = [1, 3, 2, 2] # Relative widths

        # Create header row
        header_cols = st.columns(cols_widths)
        for i, header_text in enumerate(headers):
            with header_cols[i]:
                st.markdown(f"<p class='table-header'><th>{header_text}</th></p>", unsafe_allow_html=True)

        st.markdown("---") # Visual separator below header

        for user in users:
            row_cols = st.columns(cols_widths)
            with row_cols[0]:
                st.markdown(f"<p class='table-row'><td>{user.get('id', 'N/A')}</td></p>", unsafe_allow_html=True)
            with row_cols[1]:
                st.markdown(f"<p class='table-row'><td>{user.get('email', 'N/A')}</td></p>", unsafe_allow_html=True)
            with row_cols[2]:
                role_display = user.get('role', 'N/A').replace('ROLE_', '')
                st.markdown(f"<p class='table-row'><td><span class='role-badge'>{role_display}</span></td></p>", unsafe_allow_html=True)
            with row_cols[3]:
                # Streamlit requires unique keys for buttons
                edit_key = f"edit_{user['userId']}"
                delete_key = f"delete_{user['userId']}"

                # Use columns within this cell to place buttons side-by-side
                btn_col1, btn_col2 = st.columns(2)
                with btn_col1:
                    st.button("✏️", key=edit_key, on_click=on_edit_user_click, args=(user,), help="Modifier", type="secondary")
                with btn_col2:
                    st.button("🗑️", key=delete_key, on_click=on_delete_user_click, args=(user['userId'],), help="Supprimer", type="secondary")