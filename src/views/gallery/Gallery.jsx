import React, { useState, useCallback } from "react";

import GalleryImg from "react-photo-gallery";




import Carousel, { Modal, ModalGateway } from "react-images";

import { photos } from "./photos";


// reactstrap components
import {
    Button,
    ButtonGroup,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    CardTitle,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    Label,
    FormGroup,
    Input,
    Progress,
    Table,
    Row,
    Col,
    UncontrolledTooltip
} from "reactstrap";


class Gallery extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {

    }
 






    
    render() {

        function PhotosImgs() {

            const [currentImage, setCurrentImage] = useState(0);
            const [viewerIsOpen, setViewerIsOpen] = useState(false);

            const openLightbox = useCallback((event, { photo, index }) => {
                setCurrentImage(index);
                setViewerIsOpen(true);
            }, []);

            const closeLightbox = () => {
                setCurrentImage(0);
                setViewerIsOpen(false);
            };

            return (
                <div>
                    <GalleryImg photos={photos} onClick={openLightbox} />
                    <ModalGateway>
                        {viewerIsOpen ? (
                            <Modal onClose={closeLightbox}>
                                <Carousel
                                    currentIndex={currentImage}
                                    views={photos.map(x => ({
                                        ...x,
                                        srcset: x.srcSet,
                                        caption: x.title
                                    }))}
                                />
                            </Modal>
                        ) : null}
                    </ModalGateway>

                </div>
            );
        }


        return (
            <>
                <div className="content">
                    <Row>
                        <Col xs="12">
                            <Card className="card-chart">
                                <CardHeader>



                                    <h2>Gallery Deposit Outside</h2>
                                    <h3>08/27/2019</h3>



                                </CardHeader>
                                <CardBody>
                                    <PhotosImgs />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </>
        );
    }
}

export default Gallery;
