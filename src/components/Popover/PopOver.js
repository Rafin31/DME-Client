import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Iconify from '../iconify';


export default function PopOver({ source = "null", option = [], id, setOpen = null, ...other }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const navigate = useNavigate()
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleSubmit = (id, lebel, fromPage = "") => {

        if (source === "patient-page") {
            if (lebel === "Documents") {
                navigate(`/DME-supplier/dashboard/patient-document/${id}`)
            }
            if (lebel === "Profile") {
                navigate(`/DME-supplier/dashboard/user-profile/${id}`)
            }
            if (lebel === "Edit") {
                navigate(`/DME-supplier/dashboard/edit-user-profile/${id}?user=patient`)
            }
            if (lebel === "Note") {
                navigate(`/DME-supplier/dashboard/add-patient-note/${id}`)
            }
            if (lebel === "Order History") {
                navigate(`/DME-supplier/dashboard/order-history/${id}`)
            }
            if (lebel === "Delete") {
                other.deletePatient(id)
            }
        }
        if (source === "doctor-page") {
            if (lebel === "Assign Client") {
                other.setAddPatientOpen(true)
                other.setInvitedDoctor(id)
            }
            if (lebel === "Note") {
                navigate(`/DME-supplier/dashboard/add-doctor-note/${id}`)
            }
        }

        if (source === "veteran-page") {
            if (lebel === "Profile") {
                navigate(`/DME-supplier/dashboard/user-profile/${id}`)
            }
            if (lebel === "Documents") {
                navigate(`/DME-supplier/dashboard/veteran-document/${id}`)
            }
            if (lebel === "Edit") {
                navigate(`/DME-supplier/dashboard/edit-user-profile/${id}?user=veteran`)
            }
            if (lebel === "Notes") {
                navigate(`/DME-supplier/dashboard/add-veteran-note/${id}`)
            }
            if (lebel === "Add VA Prosthetics") {
                other.setAddedVeteran(other.user)
                other.setAddVaModalOpen(true)
            }
            if (lebel === "Order History") {
                navigate(`/DME-supplier/dashboard/order-history/${id}`)
            }
        }

        else if (source === "order-page") {
            if (lebel === "Edit") {
                if (fromPage === "states") {
                    other.setEditOrderModal(true)
                    other.setEditedOrderId(id)
                } else {
                    navigate(`/DME-supplier/dashboard/edit-order/${id}?orderCategory=equipment-order`)
                }
            }
            if (lebel === "Documents") {
                navigate(`/DME-supplier/dashboard/order-document/${id}?orderCategory=equipment-order`)
            }
            if (lebel === "Add Note") {
                navigate(`/DME-supplier/dashboard/edit-order/${id}?orderCategory=equipment-order`)
            }
            if (lebel === "Note Log") {
                if (other?.orderStatus === "archived") {
                    navigate(`/DME-supplier/dashboard/order-note-log/${id}?orderCategory=equipment-order&orderStatus=archived`)
                } else {
                    navigate(`/DME-supplier/dashboard/order-note-log/${id}?orderCategory=equipment-order`)
                }
            }
            if (lebel === "Status") {
                navigate(`/DME-supplier/dashboard/edit-order/${id}?orderCategory=equipment-order`)
            }
            if (lebel === "Delete") {
                other.deleteOrder(id)
            }
        }

        else if (source === "repair-order-page") {
            if (lebel === "Edit") {
                if (fromPage === "states") {
                    other.setEditOrderModal(true)
                    other.setEditedOrderId(id)
                } else {
                    navigate(`/DME-supplier/dashboard/edit-order/${id}?orderCategory=repair-order`)
                }
            }
            if (lebel === "Documents") {
                navigate(`/DME-supplier/dashboard/order-document/${id}?orderCategory=repair-order`)
            }
            if (lebel === "Add Note") {
                navigate(`/DME-supplier/dashboard/edit-order/${id}?orderCategory=repair-order`)
            }
            if (lebel === "Note Log") {
                if (other?.orderStatus === "archived") {
                    navigate(`/DME-supplier/dashboard/order-note-log/${id}?orderCategory=repair-order&orderStatus=archived`)
                } else {
                    navigate(`/DME-supplier/dashboard/order-note-log/${id}?orderCategory=repair-order`)
                }
            }
            if (lebel === "Status") {
                navigate(`/DME-supplier/dashboard/edit-order/${id}?orderCategory=repair-order`)
            }
            if (lebel === "Delete") {
                other.deleteOrder(id)
            }
        }

        else if (source === "veteran-order-page") {
            if (lebel === "Edit") {
                if (fromPage === "states") {
                    other.setEditOrderModal(true)
                    other.setEditedOrderId(id)
                } else {
                    navigate(`/DME-supplier/dashboard/edit-order/${id}?orderCategory=veteran-order`)
                }
            }
            if (lebel === "Documents") {
                navigate(`/DME-supplier/dashboard/order-document/${id}?orderCategory=veteran-order`)
            }
            if (lebel === "Add Note") {
                navigate(`/DME-supplier/dashboard/edit-order/${id}?orderCategory=veteran-order`)
            }
            if (lebel === "Note Log") {
                if (other?.orderStatus === "archived") {
                    navigate(`/DME-supplier/dashboard/order-note-log/${id}?orderCategory=veteran-order&orderStatus=archived`)
                } else {
                    navigate(`/DME-supplier/dashboard/order-note-log/${id}?orderCategory=veteran-order`)
                }

            }
            if (lebel === "Status") {
                navigate(`/DME-supplier/dashboard/edit-order/${id}?orderCategory=veteran-order`)
            }
            if (lebel === "Delete") {
                other.deleteOrder(id)
            }
        }

        else if (source === "veteran-notes-page") {
            if (lebel === "Edit") {
                other.setEdit(true)
                other.setEditNoteId(id)
                setOpen(true)
            }
            if (lebel === "Delete") {
                other.deleteFunction(id)
            }
            if (lebel === "Publish") {
                const note = other.note
                const writerId = other.writerId
                other.setPublishNote({ note, writerId })
                other.setPublish(true)
            }
        }

        else if (source === "patient-notes-page") {
            if (lebel === "Edit") {
                other.setEdit(true)
                other.setEditNoteId(id)
                setOpen(true)
            }
            if (lebel === "Delete") {
                other.deleteFunction(id)
            }
            if (lebel === "Publish") {
                const note = other.note
                const writerId = other.writerId
                other.setPublishNote({ note, writerId })
                other.setPublish(true)
            }
        }

        else if (source === "invited-staff-page") {
            if (lebel === "Delete") {
                other.handelDeleteInvitedStaff(id)
            }
        }

        else if (source === "staff-registered-page") {
            if (lebel === "Edit") {
                navigate(`/DME-supplier/dashboard/edit-staff-profile/${id}?staff=staff`)
            }
            if (lebel === "Delete") {
                other.handelDeleteRegisteredStaff(id)
            }
        }

        else if (source === "assigned-task-page") {
            if (lebel === "Accept") {
                other.handleAssignTaskUpdate(["Accepted", id])
            }
            if (lebel === "Reject") {
                other.handleAssignTaskUpdate(["Rejected", id])
            }
            if (lebel === "Completed") {
                other.handleAssignTaskUpdate(["Completed", id])
            }
        }

        else if (source === "va-staff-registered-page") {
            if (lebel === "Edit") {
                navigate(`/DME-supplier/dashboard/edit-va-prosthetics-staff/${id}`)
            }
            if (lebel === "Delete") {
                other.handelDeleteRegisteredStaff(id)
            }
        }

        setAnchorEl(null);
    };

    return (
        <div>
            <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                <Iconify icon={'eva:more-vertical-fill'} />
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleSubmit}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
                style={{ width: "200px" }}
            >
                {
                    option.length !== 0 && option.map((item) => {
                        return (
                            <MenuItem sx={{ color: item?.color }} onClick={() => handleSubmit(id, item.label, item?.fromPage)}>
                                {
                                    item?.icon && item.icon
                                }
                                {
                                    item.label
                                }
                            </MenuItem>
                        )
                    })
                }
            </Menu>
        </div>
    );
}