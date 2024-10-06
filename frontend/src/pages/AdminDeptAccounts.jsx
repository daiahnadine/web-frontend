import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import styles from '../styles/AdminDeptAccounts.module.css'; // Using CSS Module for styling
import homeIcon from '../assets/home.png';
import requestIcon from '../assets/bdept.png';
import userIcon from '../assets/user.png';
import rcLogo from '../assets/rc_logo.png';
import deleteIcon from '../assets/delete.svg';
import avatar from '../assets/avatar.png';

const ConfirmationModal = ({ isOpen, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <p>{message}</p>
                <div className={styles.modalActions}>
                    <button className={styles.modalButton} onClick={onConfirm}>Yes</button>
                    <button className={styles.modalButton} onClick={onCancel}>No</button>
                </div>
            </div>
        </div>
    );
};

const AdminDeptAccounts = () => {
    const [advisers, setAdvisers] = useState([]);
    const [cashiers, setCashiers] = useState([]);
    const [clinics, setClinics] = useState([]);
    const [clusterCoordinators, setClusterCoordinators] = useState([]);
    const [deans, setDeans] = useState([]);
    const [guidances, setGuidances] = useState([]);
    const [laboratories, setLaboratories] = useState([]);
    const [libraries, setLibraries] = useState([]);
    const [registrars, setRegistrars] = useState([]);
    const [spiritualAffairs, setSpiritualAffairs] = useState([]);
    const [studentAffairs, setStudentAffairs] = useState([]);
    const [studentDisciplines, setStudentDisciplines] = useState([]);
    const [supremeStudentCouncils, setSupremeStudentCouncils] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("");
    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate();

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedType, setSelectedType] = useState("");

    const apiUrl = "http://localhost:8080/Dashboard/accounts";

    useEffect(() => {
        axios.get(apiUrl)
            .then(response => {
                const {
                    advisers,
                    cashiers,
                    clinics,
                    clusterCoordinators,
                    deans,
                    guidances,
                    laboratories,
                    libraries,
                    registrars,
                    spiritualAffairs,
                    studentAffairs,
                    studentDisciplines,
                    supremeStudentCouncils
                } = response.data;

                setAdvisers(advisers.map(item => ({ ...item, type: 'Adviser' })));
                setCashiers(cashiers.map(item => ({ ...item, type: 'Cashier' })));
                setClinics(clinics.map(item => ({ ...item, type: 'Clinic' })));
                setClusterCoordinators(clusterCoordinators.map(item => ({ ...item, type: 'ClusterCoordinator' })));
                setDeans(deans.map(item => ({ ...item, type: 'Dean' })));
                setGuidances(guidances.map(item => ({ ...item, type: 'Guidance' })));
                setLaboratories(laboratories.map(item => ({ ...item, type: 'Laboratory' })));
                setLibraries(libraries.map(item => ({ ...item, type: 'Library' })));
                setRegistrars(registrars.map(item => ({ ...item, type: 'Registrar' })));
                setSpiritualAffairs(spiritualAffairs.map(item => ({ ...item, type: 'SpiritualAffairs' })));
                setStudentAffairs(studentAffairs.map(item => ({ ...item, type: 'StudentAffairs' })));
                setStudentDisciplines(studentDisciplines.map(item => ({ ...item, type: 'StudentDiscipline' })));
                setSupremeStudentCouncils(supremeStudentCouncils.map(item => ({ ...item, type: 'SupremeStudentCouncil' })));
            })
            .catch(error => {
                console.error("There was an error fetching the data!", error);
            });
    }, []);

    const getType = (entity) => {
        return entity.type || "Unknown";
    };

    const allDepartments = [
        ...advisers,
        ...cashiers,
        ...clinics,
        ...clusterCoordinators,
        ...deans,
        ...guidances,
        ...laboratories,
        ...libraries,
        ...registrars,
        ...spiritualAffairs,
        ...studentAffairs,
        ...studentDisciplines,
        ...supremeStudentCouncils
    ];

    // Filter by search term and department type
    const filteredDepartments = allDepartments.filter(person => {
        const fullName = `${person.firstName} ${person.middleName ? person.middleName + ' ' : ''}${person.lastName}`.toLowerCase();
        
        const matchesSearchTerm = fullName.includes(searchTerm.toLowerCase());
        const matchesFilterType = filterType ? person.type.toLowerCase() === filterType.toLowerCase() : true;

        return matchesSearchTerm && matchesFilterType;
    });

    const handleDeleteClick = (id, type) => {
        setSelectedId(id);
        setSelectedType(type);
        setIsModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        const endpointMap = {
            'Adviser': `/Adviser/advisers/${selectedId}`,
            'Cashier': `/Cashier/cashiers/${selectedId}`,
            'Clinic': `/Clinic/clinics/${selectedId}`,
            'ClusterCoordinator': `/Cluster/coordinators/${selectedId}`,
            'Dean': `/Dean/deans/${selectedId}`,
            'Guidance': `/Guidance/guidances/${selectedId}`,
            'Laboratory': `/Laboratory/laboratories/${selectedId}`,
            'Library': `/Library/libraries/${selectedId}`,
            'Registrar': `/Registrar/registrars/${selectedId}`,
            'SpiritualAffairs': `/Spiritual/affairs/${selectedId}`,
            'StudentAffairs': `/Student/affairs/${selectedId}`,
            'StudentDiscipline': `/Prefect/prefects/${selectedId}`,
            'SupremeStudentCouncil': `/Council/councils/${selectedId}`
        };

        const endpoint = endpointMap[selectedType];

        if (endpoint) {
            axios.delete(`http://localhost:8080${endpoint}`)
                .then(() => {
                    alert('Item deleted successfully');
                    setIsModalOpen(false);
                    window.location.reload(); // Refresh the page after deletion
                })
                .catch(error => {
                    console.error("There was an error deleting the item!", error);
                    setIsModalOpen(false);
                });
        } else {
            console.error("Unknown type:", selectedType);
            setIsModalOpen(false);
        }
    };

    const handleDeleteCancel = () => {
        setIsModalOpen(false);
        setSelectedId(null);
        setSelectedType("");
    };

    const toggleModal = () => {
        setShowModal(!showModal); // Toggle modal visibility
    };

    const handleLogout = () => {
        console.log("Logged out");
        // Implement logout logic here
    };

    return (
        <div className={styles.flexContainer}>
            <div className={styles.sidebar}>
                <nav className={styles.nav}>
                    <button className={styles.ghostButton} onClick={() => navigate('/admin-dashboard')}>
                        <img src={homeIcon} alt="Home" className={styles.navIcon} />
                        Dashboard
                    </button>
                    <button className={styles.whiteButton} onClick={() => navigate('/admin-dept-accounts')}>
                        <img src={requestIcon} alt="Department" className={styles.navIcon} />
                        Department
                    </button>
                    <button className={styles.ghostButton} onClick={() => navigate('/admin-student-accounts')}>
                        <img src={userIcon} alt="Students" className={styles.navIcon} />
                        Students
                    </button>
                </nav>
            </div>

            <div className={styles.mainContent}>
                <div className={styles.header}>
                    <h2 className={styles.dashboardTitle}>Department Accounts</h2>
                    <div className={styles.headerRight}>
                        <span className={styles.academicYear}>A.Y. 2024 - 2025</span>
                        <span className={styles.semesterBadge}>First Semester</span>
                        <div className={styles.avatar} onClick={toggleModal}>
                            <img src={avatar} alt="Avatar" />
                        </div>
                        {showModal && (
                            <div className={styles.modal}>
                                <ul>
                                    <li onClick={handleLogout}>Log Out</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.filterContainer}>
                    <div className={styles.inputBox}>
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="Search by name"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className={styles.inputBox}>
                        <select
                            className={styles.filterButton}
                            value={filterType} // Ensuring filterType is used
                            onChange={e => setFilterType(e.target.value)}
                        >
                            <option value="">Department</option>
                            <option value="Adviser">Adviser</option>
                            <option value="Cashier">Cashier</option>
                            <option value="Clinic">Clinic</option>
                            <option value="ClusterCoordinator">Cluster Coordinator</option>
                            <option value="Dean">Dean</option>
                            <option value="Guidance">Guidance</option>
                            <option value="Laboratory">Laboratory</option>
                            <option value="Library">Library</option>
                            <option value="Registrar">Registrar</option>
                            <option value="SpiritualAffairs">Spiritual Affairs</option>
                            <option value="StudentAffairs">Student Affairs</option>
                            <option value="StudentDiscipline">Student Discipline</option>
                            <option value="SupremeStudentCouncil">SSC</option>
                        </select>
                    </div>
                </div>

                <table className={styles.clearanceTable}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Department</th>
                            <th>Name</th>
                            <th>Employee Number</th>
                            <th>Address</th>
                            <th>Contact Number</th>
                            <th>Email</th>
                            <th>Civil Status</th>
                            <th>Birthday</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDepartments.map(person => (
                            <tr key={person.id}>
                                <td>{person.id}</td>
                                <td>{getType(person)}</td>
                                <td>{person.firstName} {person.middleName || ''} {person.lastName}</td>
                                <td>{person.employeeNumber || ''} {person.deanNumber || ''} {person.supremeStudentCouncilNumber || ''}</td>
                                <td>{person.address || "N/A"}</td>
                                <td>{person.contactNumber || "N/A"}</td>
                                <td>{person.email || "N/A"}</td>
                                <td>{person.civilStatus || "N/A"}</td>
                                <td>{person.birthdate ? new Date(person.birthdate).toLocaleDateString() : "N/A"}</td>
                                <td>
                                    <img
                                        src={deleteIcon}
                                        alt="Delete"
                                        className={styles.actionIcon}
                                        onClick={() => handleDeleteClick(person.id, getType(person))}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={isModalOpen}
                message="Are you sure you want to delete this account?"
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
            />
        </div>
    );
};

export default AdminDeptAccounts;
