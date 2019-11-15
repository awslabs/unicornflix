import React, { Component } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { Grid, Col, Row } from 'react-styled-flexboxgrid';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import BottomScrollListener from 'react-bottom-scroll-listener';
import { onCreateVodAsset } from '../../graphql/subscriptions';
import './index.css';
import VideoPlayer from '../VideoPlayer';
import GridCardView from '../GridCardView';
import * as queries from '../../graphql/queries';
import 'video.js/dist/video-js.css';
import awsvideo from '../../aws-video-exports';

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
    const assets = await API.graphql(graphqlOperation(queries.listVodAssets));
    let { nextToken } = assets.data.listVodAssets;
    if (nextToken === undefined) {
      nextToken = '';
    }
    this.setState({ items: assets.data.listVodAssets.items, nextToken });
    this.listenForNewAssets();
  }

  hideMovie = () => {
    this.setState({
      displayingMovie: false,
    });
  }

  displayMovie = (item) => {
    this.setState({
      sources: [{
        src: `https://${awsvideo.awsOutputVideo}.s3.amazonaws.com/output/${item.video.id}.m3u8`,
        type: 'application/x-mpegURL',
      }],
      displayingMovie: true,
      choosenItem: item,
    });
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
    API.graphql(
      graphqlOperation(onCreateVodAsset),
    ).subscribe({
      next: (((data) => {
        const { items } = this.state;
        const newItems = items.push(data.value.data.onCreateVodAsset);
        this.setState({
          items: newItems,
        });
      })),
    });
  }

  async handleOnDocumentBottom() {
    const { nextToken, items } = this.state;
    if (nextToken !== '' && nextToken !== undefined) {
      const assets = await API.graphql(graphqlOperation(queries.listVodAssets, { nextToken }));
      const newItems = items.concat(assets.data.listVodAssets.items);
      let { newNextToken } = assets.data.listVodAssets;
      if (newNextToken === undefined) {
        newNextToken = '';
      }
      this.setState({ items: newItems, nextToken: newNextToken });
    }
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
