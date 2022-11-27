import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Iconify from '../iconify';


export default function PopOver({ source = "null", option, id, setOpen = null }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const navigate = useNavigate()
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleSubmit = (id, lebel) => {

        if (source === "patient-page") {
            if (lebel === "Documents") {
                navigate(`/DME-supplier/dashboard/patient-document/${id}`)
            }
            if (lebel === "Edit") {
                navigate(`/DME-supplier/dashboard/edit-patient-profile/${id}`)
            }
            if (lebel === "Add Note") {
                navigate(`/DME-supplier/dashboard/add-patient-note/${id}`)
            }
        }

        else if (source === "order-page") {
            if (lebel === "Edit") {
                navigate(`/DME-supplier/dashboard/edit-order/${id}`)
            }
            if (lebel === "Documents") {
                navigate(`/DME-supplier/dashboard/order-document/${id}`)
            }
            if (lebel === "Add Note") {
                navigate(`/DME-supplier/dashboard/edit-order/${id}`)
            }
            if (lebel === "Status") {
                navigate(`/DME-supplier/dashboard/edit-order/${id}`)
            }
        }

        else if (source === "patient-notes-page") {
            if (lebel === "Edit") {
                setOpen(true)
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
                    option.map((item) => {
                        return (
                            <MenuItem onClick={() => handleSubmit(id, item.label)}>{item.label}</MenuItem>
                        )
                    })
                }
            </Menu>
        </div>
    );
}