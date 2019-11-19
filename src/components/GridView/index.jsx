/* eslint-disable import/order */
import React, { Component } from 'react';
import { Grid, Col, Row } from 'react-styled-flexboxgrid';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import BottomScrollListener from 'react-bottom-scroll-listener';
import './index.css';
import VideoPlayer from '../VideoPlayer';
import GridCardView from '../GridCardView';
import 'video.js/dist/video-js.css';
// Insert Location 9

// Insert Location 12

// Insert Location 14


class GridView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayingMovie: false,
      choosenItem: {},
      nextToken: '',
      sources: [],
      items: [],
    };

    this.handleOnDocumentBottom = this.handleOnDocumentBottom.bind(this);
  }

  async componentDidMount() {
    // Insert Location 10

    // Insert Location 16

  }

  hideMovie = () => {
    this.setState({
      displayingMovie: false,
    });
  }

  displayMovie = (item) => {
    // Insert Location 13

  }

  overlayMovie = () => {
    const { displayingMovie, sources, choosenItem: { title, description } } = this.state;
    return (
      <Modal id="popup" style={{ maxWidth: 755 }} isOpen={displayingMovie} toggle={this.hideMovie}>
        <ModalHeader toggle={this.hideMovie}>{title}</ModalHeader>
        <ModalBody>
          {description}
          <VideoPlayer
            controls
            sources={sources}
            width={720}
            height={420}
            bigPlayButton={false}
            autoplay
          />
        </ModalBody>
      </Modal>
    );
  }

  listenForNewAssets = () => {
    // Insert Location 15

  }

  async handleOnDocumentBottom() {
    // Insert Location 11

  }

  render() {
    const { items } = this.state;
    const itemHTML = items.map((item) => (
      <Col xs={6} sm={4} lg={3.5} style={{ paddingTop: 15, paddingBottom: 15 }} key={item.id}>
        <button type="button" onClick={(e) => this.displayMovie(item, e)} aria-label={item.title}><GridCardView item={item} /></button>
      </Col>
    ));

    return (
      <div style={{ paddingTop: 85 }}>
        {this.overlayMovie()}
        <BottomScrollListener onBottom={this.handleOnDocumentBottom} />
        <Grid fluid>
          <Row>
            {itemHTML}
          </Row>
        </Grid>
      </div>
    );
  }
}

export default GridView;
