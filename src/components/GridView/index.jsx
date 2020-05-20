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
import Amplify, { API, graphqlOperation } from 'aws-amplify';
import * as queries from '../../graphql/queries';
// Insert Location 12
import awsvideo from '../../aws-video-exports';

// Insert Location 14
import { onCreateVodAsset } from '../../graphql/subscriptions';


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
    const assets = await API.graphql(graphqlOperation(queries.listVodAssets));
    let { nextToken } = assets.data.listVodAssets;
    if (nextToken === undefined) {
      nextToken = '';
    }
    this.setState({ items: assets.data.listVodAssets.items, nextToken });
        
    // Insert Location 16
    this.listenForNewAssets();
  }

  hideMovie = () => {
    this.setState({
      displayingMovie: false,
    });
  }

  displayMovie = (item) => {
    // Insert Location 13
// eslint-disable-next-line no-underscore-dangle
const region = Amplify._config.aws_project_region;
console.log(item.video.video);
this.setState({
  sources: [{
      src: `https://${awsvideo.awsOutputVideo}/public/${item.video.id}/${item.video.id}.m3u8`,
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
    // Insert Location 15
    API.graphql(
      graphqlOperation(onCreateVodAsset),
    ).subscribe({
      next: (((data) => {
        const { items } = this.state;
        items.push(data.value.data.onCreateVodAsset);
        this.setState({
          items,
        });
      })),
    });
  }

  async handleOnDocumentBottom() {
    // Insert Location 11
    const { nextToken, items } = this.state;
    if (nextToken !== '' && nextToken !== null && nextToken !== undefined) {
      console.log(nextToken);
      const assets = await API.graphql(graphqlOperation(queries.listVodAssets, { nextToken }));
      const newItems = items.concat(assets.data.listVodAssets.items);
      let newNextToken = assets.data.listVodAssets.nextToken;
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
